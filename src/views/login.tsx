import { LoginForm, SignUpForm } from "../components/auth/Form";

const LoginView = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <div>
      <h1 className="text-center mt-10 mb-4">Login!</h1>
        <LoginForm />
      </div>
      <div>
        <h1 className="text-center mt-10 mb-4">Sign up!</h1>
        <SignUpForm />
      </div>
    </div>
  );
};

export default LoginView;
