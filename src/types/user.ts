interface IUser {
  name: string;
  phone?: string;
  email: string;
  gender?: "M" | "F" | "O";
  dob?: Date;
  addressLine1?: string;
  addressLine2?: string;
}

export default IUser;
