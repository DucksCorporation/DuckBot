module.exports = class Commands {
    constructor(client, data) {
        this.client = client;

        this.name = data.name;
        this.description = data.description;
        this.category = data.category;
        this.owner = data.owner;
        this.args = data.args
        this.slash = data.slash;
        this.options = data.options;
    };
};