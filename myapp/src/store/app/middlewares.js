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

export const modalMiddleware = (store) => (next) => (action) => {
    if (action.type === 'app/showModal') {
        modalChildren.content = action.payload.children;
        delete action.payload.children;
    }

    return next(action);
};

export const modalChildren = {
    content: null,
};
