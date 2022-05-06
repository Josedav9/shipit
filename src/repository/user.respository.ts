import { User } from "../model/user.model";
import { UserModel } from "../integration/DTOs";

export const findUserBySlackId = (slackUserId: string) => {
  return User.findOne<UserModel>({
    slackUserId,
  });
};

export const findUsersByGithubId = (githubUsers: string[] ) => {
  return User.find<UserModel>({
    githubUser: { $in: githubUsers },
  });
}

export const createNewUser = (
  githubUser: string,
  slackUserId: string
): Promise<UserModel> => {
  const newRegister = new User({
    githubUser,
    slackUserId,
  });
  return newRegister.save();
};
