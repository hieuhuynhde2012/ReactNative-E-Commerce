export const alertMiddleware = (store) => (next) => (action) => {
    if (action.type === 'app/showAlert') {
        alertCallback.onConfirm = action.payload.onConfirm;
        alertCallback.onCancel = action.payload.onCancel;

        delete action.payload.onConfirm;
        delete action.payload.onCancel;
    }

    return next(action);
};

export const alertCallback = {
    onConfirm: null,
    onCancel: null,
};
