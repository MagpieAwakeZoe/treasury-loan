const pickupList = {
    namespaced: true,
    state: {
        fuzzyQueryParam: ''
    },
    mutations: {
        search (state, str) {
            state.fuzzyQueryParam = str;
        }
    },
    actions: { },
};

export default pickupList;