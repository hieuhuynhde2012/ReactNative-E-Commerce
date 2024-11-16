const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const {
    generateAccessToken,
    generateRefreshToken,
} = require('../middlewares/jwt');
const jwt = require('jsonwebtoken');
const sendMail = require('../utils/sendMail');
const crypto = require('crypto');
const makeToken = require('uniqid');
const { users } = require('../utils/constant');

// Register user
const register = asyncHandler(async (req, res) => {
    const { email, password, firstname, lastname, mobile } = req.body;
    if (!email || !password || !firstname || !lastname || !mobile) {
        return res.status(400).json({
            success: false,
            message: 'Missing input',
        });
    }
    const user = await User.findOne({ email });
    if (user) {
        throw new Error('User already exists');
    } else {
        const token = makeToken();
        const tokenizedEmail = btoa(email) + '@' + token;
        const tempUser = await User.create({
            email: tokenizedEmail,
            password,
            firstname,
            lastname,
            mobile,
        });

        if (tempUser) {
            const html = `<h2>Register code:</h2><br><blockquote>${token}</blockquote>`;
            await sendMail({
                email,
                html,
                subject: 'Completing register process!',
            });
        }

        setTimeout(async () => {
            await User.findOneAndDelete({ email: tokenizedEmail });
        }, [300000]);

        res.json({
            success: tempUser ? true : false,
            message: tempUser
                ? 'Please check your email to complete registration!'
                : 'Registration failed!',
        });
    }
});

const completeRegister = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const notActiveEmail = await User.findOne({
        email: new RegExp(`${token}$`),
    });

    if (notActiveEmail) {
        notActiveEmail.email = atob(notActiveEmail?.email?.split('@')[0]);
        notActiveEmail.save();
    }
    res.json({
        success: notActiveEmail ? true : false,
        message: notActiveEmail
            ? 'Registration succeed'
            : 'Registration failed!',
    });

    // if (newUser) {
    //   return res.redirect(`${process.env.CLIENT_URL}/completeregister/succeed`);
    // } else {
    //   return res.redirect(`${process.env.CLIENT_URL}/completeregister/failed`);
    // }
});

// Refresh token is used to generate new access token
// Access token is used to authenticate user and assign role
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Missing input',
        });
    }

    const response = await User.findOne({ email });
    if (response && (await response.isCorrectPassword(password))) {
        // Remove password from response
        const { role, password, refreshToken, ...userData } =
            response.toObject();

        // Generate tokens
        const accessToken = generateAccessToken(response._id, role);
        const newRefreshToken = generateRefreshToken(response._id);

        // Save refresh token in database
        await User.findByIdAndUpdate(
            response._id,
            { refreshToken: newRefreshToken },
            { new: true },
        );

        // Save refresh token in cookie
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return res.status(200).json({
            success: true,
            accessToken,
            userData,
        });
    } else {
        throw new Error('Invalid credentials!');
    }
});

// Get current user
const getCurrent = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const user = await User.findById({ _id })
        .select('-refreshToken -password')
        .populate({
            path: 'cart.product',
            select: 'title thumb price ',
        })
        .populate('wishlist', 'title thumb price color');

    return res.status(200).json({
        success: user ? true : false,
        rs: user ? user : 'User not found',
    });
});

// Refresh token is used to generate new access token
const refreshAccessToken = asyncHandler(async (req, res) => {
    // Get refresh token from cookie
    const cookie = req.cookies;

    // Check if refresh token exists
    if (!cookie && !cookie.refreshToken) {
        throw new Error('No refresh token in cookie');
    }

    const rs = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET);
    const response = await User.findOne({
        _id: rs._id,
        refreshToken: cookie.refreshToken,
    });
    return res.status(200).json({
        success: response ? true : false,
        newAccessToken: response
            ? generateAccessToken(response._id, response.role)
            : 'refresh token expired! Please login again!',
    });
});

// Logout
const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie || !cookie.refreshToken) {
        throw new Error('No refresh token in cookie');
    }

    // Delete refresh token from database
    await User.findOneAndUpdate(
        { refreshToken: cookie.refreshToken },
        { refreshToken: '' },
        { new: true },
    );

    // Delete refresh token from cookie
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
    });

    return res.status(200).json({
        success: true,
        message: 'Logout successful',
    });
});

// forgot password - send reset token to user's email
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        throw new Error('Please provide email');
    }
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('User not found');
    }

    const resetToken = user.createPasswordResetToken();
    await user.save();

    const html = `
    <p>Hello ${email},</p>
    <p>Your OTP is: <strong>${resetToken}</strong></p>
    <p>This OTP is valid for 15 minutes. Please do not share it with anyone.</p>
    <p>If you did not request this, please ignore this email.</p>
    <p>Thank you,<br>Digital World Team</p>
  `;

    const data = {
        email,
        html,
        subject: 'Forgot password',
    };

    const rs = await sendMail(data);

    return res.status(200).json({
        success: rs.response?.includes('OK') ? true : false,
        message: rs.response?.includes('OK')
            ? 'Please check your email to reset password!'
            : 'Failed to send email',
    });
});

// reset password
const resetPassword = asyncHandler(async (req, res) => {
    const { password, token } = req.body;
    if (!password || !token) {
        throw new Error('Please provide password and reset token');
    }
    const passwordResetToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');
    const user = await User.findOne({
        passwordResetToken,
        passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) {
        throw new Error('Token is invalid or expired');
    }
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordChangedAt = Date.now();
    user.passwordResetExpires = undefined;
    await user.save();
    return res.status(200).json({
        success: user ? true : false,
        message: user ? 'Password reset successful' : 'Password reset failed',
    });
});

// Get all users
const getUsers = asyncHandler(async (req, res) => {
    const queries = { ...req.query };

    // Separate the specified fields from queries
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queries[el]);

    // Format the queries to be used in mongoose
    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(
        /\b(gte|gt|lt|lte)\b/g,
        (matchedEl) => `$${matchedEl}`,
    );

    const formattedQueries = JSON.parse(queryString);

    // Filtering
    if (queries?.name) {
        formattedQueries.name = { $regex: queries.name, $options: 'i' };
    }

    if (req.query.q) {
        delete formattedQueries.q;
        formattedQueries['$or'] = [
            { firstname: { $regex: req.query.q, $options: 'i' } },
            { lastname: { $regex: req.query.q, $options: 'i' } },
            { email: { $regex: req.query.q, $options: 'i' } },
        ];
    }

    let queryCommand = User.find(formattedQueries);

    // Sorting
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        queryCommand = queryCommand.sort(sortBy);
    }

    // Field limiting
    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ');
        queryCommand = queryCommand.select(fields);
    }

    // Pagination
    // - litmit: number of results per API call
    // - skip: number of results to skip
    const page = +req.query.page || 1;
    const limit = +req.query.limit || process.env.PAGINATION_LIMIT;
    const skip = (page - 1) * limit;
    queryCommand = queryCommand.skip(skip).limit(limit);

    // Execute the query
    try {
        const users = await queryCommand.exec();
        if (!users || users.length === 0) throw new Error('Cannot get users!');
        const count = await User.find(formattedQueries).countDocuments();
        return res.status(200).json({
            success: users ? true : false,
            count,
            users: users ? users : 'Cannot get users!',
        });
    } catch (error) {
        throw new Error(error.message);
    }
});

// Delete user
const deleteUser = asyncHandler(async (req, res) => {
    const { uid } = req.params;
    const response = await User.findByIdAndDelete(uid);
    return res.status(200).json({
        success: response ? true : false,
        message: response
            ? `User with email ${response.email} has been deleted`
            : `User not found!`,
    });
});

// Update user
const updateUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { firstname, lastname, email, mobile, address } = req.body;
    const data = { firstname, lastname, email, mobile, address };
    if (req.file) data.avatar = req?.file?.path;
    if (!_id || Object.keys(req.body).length === 0)
        throw new Error('Missing inputs');

    const user = await User.findByIdAndUpdate(_id, data, {
        new: true,
    }).select('-refreshToken -password -role');
    return res.status(200).json({
        success: user ? true : false,
        message: user ? `User has been updated` : `User not found!`,
    });
});

// Update user by admin
const updateUserByAdmin = asyncHandler(async (req, res) => {
    const { uid } = req.params;
    if (Object.keys(req.body).length === 0) throw new Error('Missing inputs');

    const user = await User.findByIdAndUpdate(uid, req.body, {
        new: true,
    }).select('-refreshToken -password -role');
    return res.status(200).json({
        success: user ? true : false,
        message: user ? 'Updated' : 'Something went wrong!',
    });
});

// Update user address
const updateUserAddress = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    if (!req.body.address) throw new Error('Missing inputs');
    const user = await User.findByIdAndUpdate(
        _id,
        { $push: { address: req.body.address } },
        { new: true },
    ).select('-refreshToken -password -role');
    return res.status(200).json({
        success: user ? true : false,
        updatedUser: user ? user : `User not found!`,
    });
});

// Update user cart
const updateUserCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { pid, quantity = 1, color, price, thumbnail, title } = req.body;
    if (!pid || !color) throw new Error('Missing inputs');
    const user = await User.findById(_id).select('cart');
    const alreadyAdded = user?.cart?.find(
        (el) => el?.product.toString() === pid && el?.color === color,
    );
    if (alreadyAdded) {
        console.log(alreadyAdded);
        const response = await User.updateOne(
            { cart: { $elemMatch: alreadyAdded } },
            {
                $set: {
                    'cart.$.quantity': quantity,
                    'cart.$.price': price,
                    'cart.$.thumbnail': thumbnail,
                    'cart.$.title': title,
                },
            },
            { new: true },
        );
        return res.status(200).json({
            success: response ? true : false,
            message: response
                ? 'Your cart has been updated'
                : `User not found!`,
        });
    } else {
        const response = await User.findByIdAndUpdate(
            _id,
            {
                $push: {
                    cart: {
                        product: pid,
                        quantity,
                        color,
                        price,
                        thumbnail,
                        title,
                    },
                },
            },
            { new: true },
        );
        return res.status(200).json({
            success: response ? true : false,
            message: response ? 'Your cart has been update' : `User not found!`,
        });
    }
});

// Remove product from cart
const removeProductFromCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { pid, color } = req.params;
    console.log(pid);
    const user = await User.findById(_id).select('cart');
    const alreadyAdded = user?.cart?.find(
        (el) => el?.product.toString() === pid && el?.color === color,
    );
    if (!alreadyAdded) {
        return res.status(200).json({
            success: true,
            message: 'Your cart has been updated',
        });
    }
    const response = await User.findByIdAndUpdate(
        _id,
        { $pull: { cart: { product: pid, color } } },
        { new: true },
    );
    return res.status(200).json({
        success: response ? true : false,
        message: response ? 'Your cart has been update' : `User not found!`,
    });
});

const createUsers = asyncHandler(async (req, res) => {
    const response = await User.create(users);
    return res.status(200).json({
        success: response ? true : false,
        users: response ? response : `User not found!`,
    });
});

const addAdditionalAddress = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const newAddress = req.body.additionalAddress;
    if (!newAddress) throw new Error('Missing address details');

    const user = await User.findByIdAndUpdate(
        _id,
        { $push: { additionalAddress: newAddress } },
        { new: true },
    ).select('-refreshToken -password -role');

    return res.status(200).json({
        success: !!user,
        updatedUser: user || 'User not found!',
    });
});

const getAdditionalAddress = asyncHandler(async (req, res) => {
    const { _id } = req.params; 

    const user = await User.findById(_id).select('additionalAddress'); 

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found!',
        });
    }

    return res.status(200).json({
        success: true,
        additionalAddress: user.additionalAddress,
    });
});

const editAdditionalAddress = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { addressId } = req.params;
    const { additionalAddress } = req.body;
  
    if (!addressId) {
      return res.status(400).json({ success: false, message: "Missing address ID" });
    }
    if (!additionalAddress) {
      return res.status(400).json({ success: false, message: "Missing address data" });
    }
  
    const user = await User.findById(_id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
  
    const addressIndex = user.additionalAddress.findIndex((addr) => addr._id.toString() === addressId);
    if (addressIndex === -1) return res.status(404).json({ success: false, message: "Address not found" });
  
    const originalAddress = user.additionalAddress[addressIndex];
  
    // Create a new address object that merges provided fields with existing ones
    const updatedAddress = {
      name: additionalAddress.name !== undefined ? additionalAddress.name : originalAddress.name,
      mobileNo: additionalAddress.mobileNo !== undefined ? additionalAddress.mobileNo : originalAddress.mobileNo,
      houseNo: additionalAddress.houseNo !== undefined ? additionalAddress.houseNo : originalAddress.houseNo,
      street: additionalAddress.street !== undefined ? additionalAddress.street : originalAddress.street,
      landmark: additionalAddress.landmark !== undefined ? additionalAddress.landmark : originalAddress.landmark,
      country: additionalAddress.country !== undefined ? additionalAddress.country : originalAddress.country,
      postalCode: additionalAddress.postalCode !== undefined ? additionalAddress.postalCode : originalAddress.postalCode,
    };
  
    // Replace the specific address with the updated version
    user.additionalAddress[addressIndex] = updatedAddress;
  
    // Debugging console log
    console.log("Updated Address Data:", updatedAddress);
  
    const updatedUser = await user.save();
  
    return res.status(200).json({
      success: !!updatedUser,
      updatedUser: updatedUser || "User not found!",
    });
  });
  
  




const deleteAdditionalAddress = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { addressId } = req.params;

    if (!addressId) {
        return res.status(400).json({
            success: false,
            message: 'Missing address ID',
        });
    }

    const user = await User.findById(_id);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found!',
        });
    }

    const addressExists = user.additionalAddress.some(
        (address) => address._id.toString() === addressId
    );

    if (!addressExists) {
        return res.status(404).json({
            success: false,
            message: 'Address not found!',
        });
    }

    // Thực hiện xóa
    const updatedUser = await User.findByIdAndUpdate(
        _id,
        { $pull: { additionalAddress: { _id: addressId } } },
        { new: true }
    ).select('-refreshToken -password -role');

    return res.status(200).json({
        success: true,
        updatedUser,
    });
});

const setDefaultAddress = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { addressId } = req.params;  

    if (!addressId) {
        return res.status(400).json({ success: false, message: 'Missing address ID' });
    }

    const user = await User.findById(_id);
    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Đặt tất cả các địa chỉ thành không mặc định
    user.additionalAddress.forEach((address) => {
        address.isDefault = false;
    });

    // Tìm địa chỉ theo ID và đặt làm mặc định
    const address = user.additionalAddress.find((address) => address._id.toString() === addressId);
    if (!address) {
        return res.status(404).json({ success: false, message: 'Address not found' });
    }
    address.isDefault = true;

    await user.save();

    return res.status(200).json({
        success: true,
        message: 'Address set as default successfully',
        user,
    });
});

const updateWishlist = asyncHandler(async (req, res) => {
    const { pid } = req.params;
    const { _id } = req.user;
    const user = await User.findById(_id);
    const isInWishlist = user?.wishlist?.find((el) => el.toString() === pid);
    if (isInWishlist) {
        const response = await User.findByIdAndUpdate(
            _id,
            { $pull: { wishlist: pid } },
            { new: true },
        );
        return res.status(200).json({
            success: response ? true : false,
            message: response
                ? 'Successfully removed from wishlist.'
                : `failed to remove from wishlist.`,
        });
    } else {
        const response = await User.findByIdAndUpdate(
            _id,
            { $push: { wishlist: pid } },
            { new: true },
        );
        return res.status(200).json({
            success: response ? true : false,
            message: response
                ? 'Successfully added to wishlist.'
                : `failed to add to wishlist.`,
        });
    }
    return res.status(200).json({
        success: response ? true : false,
        users: response ? response : `User not found!`,
    });
});

module.exports = {
    register,
    login,
    getCurrent,
    refreshAccessToken,
    logout,
    forgotPassword,
    resetPassword,
    getUsers,
    deleteUser,
    updateUser,
    updateUserByAdmin,
    updateUserAddress,
    updateUserCart,
    completeRegister,
    createUsers,
    removeProductFromCart,
    updateWishlist,
    addAdditionalAddress,
    getAdditionalAddress,
    deleteAdditionalAddress,
    editAdditionalAddress,
    setDefaultAddress
};
