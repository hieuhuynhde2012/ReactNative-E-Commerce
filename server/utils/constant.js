exports.roles = [
    {
        code: 1999,
        value: 'Admin',
    },
    {
        code: 1998,
        value: 'User',
    },
];

exports.users = Array.from({ length: 20 }, (_, index) => {
    const userId = String(index + 1).padStart(2, '0');
    return {
        email: `user${userId}@gmail.com`,
        password: 123456,
        firstname: `User${userId}`,
        lastname: 'Test',
        mobile: `01234567${80 + index}`,
    };
});
