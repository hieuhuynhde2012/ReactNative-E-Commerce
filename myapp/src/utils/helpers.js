export const validate = (payload, setInvalidFields) => {
    let invalids = 0;
    const formatPayload = Object.entries(payload);
    for (let arr of formatPayload) {
        if (arr[1].trim() === '') {
            invalids++;
            setInvalidFields((prev) => [
                ...prev,
                { name: arr[0], message: 'This field is required!' },
            ]);
        }
    }

    for (let arr of formatPayload) {
        switch (arr[0]) {
            case 'email':
                const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                if (!arr[1].match(regex)) {
                    invalids++;
                    setInvalidFields((prev) => [
                        ...prev,
                        { name: arr[0], message: 'Invalid email' },
                    ]);
                }
                break;
            case 'password':
                if (arr[1].length < 6) {
                    invalids++;
                    setInvalidFields((prev) => [
                        ...prev,
                        {
                            name: arr[0],
                            message: 'Password must be at least 6 characters',
                        },
                    ]);
                }
                break;
            case 'mobile':
                const mobileRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;
                if (!arr[1].match(mobileRegex)) {
                    invalids++;
                    setInvalidFields((prev) => [
                        ...prev,
                        { name: arr[0], message: 'Invalid mobile number' },
                    ]);
                }
                break;
            default:
                break;
        }
    }

    return invalids;
};

export const formatCurrency = (value) => {
    if (!Number(value)) return;
    return value.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });
};
