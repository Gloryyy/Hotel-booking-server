import User from "../models/user";

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  // validation
  if (!name) return res.status(400).send("Name is required!");
  if (!password || password.length < 6)
    return res
      .status(400)
      .send("Password is required and should be at least 6 characters!");
  let userExist = await User.findOne({ email }).exec();
  if (userExist) return res.status(400).send("Email already exists");

  const user = new User(req.body);
  try {
    await user.save();
    console.log("USER CREATED", user);
    return res.json({ ok: true });
  } catch (err) {
    console.log("CREATED USER FAILED", err);
    return res.status(400).send("Error. Please try again!");
  }
};
