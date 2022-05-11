module.exports = async ({ models: { User } }, userId) => {
  const max = 8;
  const min = 1;
  
  let userDoc = await User.findById(userId);

  if (!userDoc) {
    const newUser = await User.create({ _id: userId });
    userDoc = newUser;
  }

  //~~~~~~~~~~~~~~~~~~~~~XP SYSTEM~~~~~~~~~~~~~~~~~~~~~~~//
  const { xp, level, nextLevel } = userDoc.exp;
  const newXp = Math.floor(Math.random() * max) + min;

  await User.findByIdAndUpdate(userId, {
    "exp.xp": xp + newXp,
  });

  if (xp >= nextLevel) {
    await User.findByIdAndUpdate(userId, {
      "exp.xp": 0,
      "exp.level": level + 1,
      "exp.nextLevel": nextLevel * level,
    });
  }
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
};
