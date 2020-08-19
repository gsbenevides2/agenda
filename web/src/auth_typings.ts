export type AuthContextType = null | {
  authState:AuthContextDataType;
  setAuthState:React.Dispatch<React.SetStateAction<AuthContextDataType>>
}
export type AuthContextDataType = null | boolean | {
  userId:string;
  sessionId:string;
  name:string;
  photoUrl:string;
  email:string;
}

export type RetriveCodeErrorCodes = 'invalid_scopes' | 'invalid_grant' | 'unknown_error'
