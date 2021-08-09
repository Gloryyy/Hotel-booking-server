import User from "../models/user";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
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
    await user.save();
    console.log("USER CREATED", user);
    return res.json({ ok: true });
  } catch (err) {
    console.log("CREATED USER FAILED", err);
    return res.status(400).send("Error. Please try again!");
  }
};

export const login = async (req, res) => {
  //console.log(req.body);
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email }).exec();
    // console.log("USER EXISTS", user);
    if (!user) res.status(400).send("User with that email not found");
    // compare password
    user.comparePassword(password, (err, match) => {
      console.log("COMPARE PASSWORD IN LOGIN ERROR", err);
      if (!match || err) return res.status(400).send("Wrong password");
      // GENERATE A TOKEN THEN SEND AS RESPONSE TO CLIENT
      let token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      res.json({
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          stripe_account_id: user.stripe_account_id,
          stripe_seller: user.stripe_seller,
          stripeSession: user.stripeSession,
        },
      });
    });
  } catch (err) {
    console.log("LOGIN ERROR", err);
    res.status(400).send("Signin failed");
  }
};
