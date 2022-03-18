/**
 * const Emojis = new getter(client);
 * `${Emojis.get("hello_word")} Hello`
 */

class getter {
  constructor(client) {
    this.client = client;
  }

  get(name) {
    const id = module.exports[name];
    if (!id) throw new Error(`Emoji ${name} not found`);
    else return this.client.emojis.cache.get(id);
  }
}

module.exports = {
  getter,

  // notifier
  bug: "953774891587481612",
  several: "953778781057859644",
  error: "953779688487145513",
};
