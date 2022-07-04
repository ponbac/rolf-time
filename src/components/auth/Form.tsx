import { useState } from "react";
import { login } from "../../features/auth/authSlice";
import { SUPABASE } from "../../utils/dataFetcher";
import { useAppDispatch } from "../../utils/store";

type LoginFormProps = {};
const LoginForm = (props: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useAppDispatch();

  return (
    <div className="flex flex-col gap-4">
      <input
        type="text"
        className="text-black p-1"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        className="text-black p-1"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={async () => {
          const { user, session, error } = await SUPABASE.auth.signIn({
            email: email,
            password: password,
          });

          if (user) {
            dispatch(login(user));
          }
        }}
      >
        Login
      </button>
    </div>
  );
};

type SignUpFormProps = {};
const SignUpForm = (props: SignUpFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useAppDispatch();

  return (
    <div className="flex flex-col gap-4">
      <input
        type="text"
        className="text-black p-1"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        className="text-black p-1"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={async () => {
          const { user, session, error } = await SUPABASE.auth.signUp({
            email: email,
            password: password,
          });

          if (user) {
            dispatch(login(user));
          }
        }}
      >
        Sign up
      </button>
    </div>
  );
};

export { LoginForm, SignUpForm };
