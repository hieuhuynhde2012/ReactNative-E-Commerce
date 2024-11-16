export const priceOptions = [
    {
        id: 1,
        type: 'PRICE',
        to: 5000000,
        isActive: false,
        text: 'Under 5000000VND',
    },

    {
        id: 2,
        type: 'PRICE',
        from: 5000000,
        to: 10000000,
        isActive: false,
        text: '5000000VND - 10000000VND',
    },
    {
        id: 3,
        type: 'PRICE',
        from: 10000001,
        isActive: false,
        text: 'Over 10000000VND',
    },
];

export const colorOptions = [
    {
        id: 1,
        type: 'COLOR',
        value: 'Gray',
        isActive: false,
        text: 'Gray',
    },
    {
        id: 2,
        type: 'COLOR',
        value: 'Black',
        isActive: false,
        text: 'Black',
    },
    {
        id: 3,
        type: 'COLOR',
        value: 'White',
        isActive: false,
        text: 'White',
    },
];

export const sortOptions = [
    {
        id: 1,
        value: '-sold',
        isActive: false,
        text: 'Best Selling',
    },
    {
        id: 2,
        value: 'title',
        isActive: false,
        text: 'Alphabetically: A-Z',
    },
    {
        id: 3,
        value: '-title',
        isActive: false,
        text: 'Alphabetically: Z-A',
    },
    {
        id: 4,
        value: '-price',
        isActive: false,
        text: 'Price: high to low',
    },
    {
        id: 5,
        value: 'price',
        isActive: false,
        text: 'Price: low to high',
    },
    {
        id: 6,
        value: '-createdAt',
        isActive: false,
        text: 'Date: new to old',
    },
    {
        id: 7,
        value: 'createdAt',
        isActive: false,
        text: 'Date: old to new',
    },
];
