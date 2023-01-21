import User from "../models/User.js";

// Called by server/routes/general.js when client/src/state/api.js hits http://.../general/user/[id] 
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
