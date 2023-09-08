import { $Enums } from "@prisma/client";

export class UserDTO {
  name: string;
  userType: $Enums.UserType;
  password: string;
}