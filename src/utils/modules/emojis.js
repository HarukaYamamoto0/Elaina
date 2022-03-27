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

  // base
  right: "956056869758205972",
  wrong: "956056890968780831",

  // notifier
  bug: "953774891587481612",
  several: "953778781057859644",
  error: "953779688487145513",

  // daily
  clock: "956053623517884446",
  money: "956050953713360906",

  // help
  home: "956971689785303090",
  Information: "956971652623794186",
  Owner: "956971612505255986",
  Economy: "956971671376527450",
  owner_2: "956971632772128818",
};
