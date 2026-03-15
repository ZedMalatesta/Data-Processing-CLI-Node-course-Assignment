const localSort = (a, b) => {
    return a['Name'].localeCompare(b['Name']);
};

export default localSort;