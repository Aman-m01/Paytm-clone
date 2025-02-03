import { BottomWarning } from "../components/ButtonWarning";
import { Button } from "../components/Button";
import { Heading } from "../components/HeaderBar";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { notifyError, notifySuccess } from "../utils/Toast";
import { API_URL } from "../Config/config";

export const Signin = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label={"Sign in"} />
          <SubHeading label={"Enter your credentials to access your account"} />
          <InputBox
            onChange={(e) => setUserName(e.target.value)}
            placeholder="aman@gmail.com"
            label={"Email"}
          />
          <InputBox
            onChange={(e) => setPassword(e.target.value)}
            placeholder="123456"
            label={"Password"}
          />
          <div className="pt-4">
            <Button
              onClick={async () => {
                try {
                  const response = await axios.post(
                    `${API_URL}/api/v1/user/login`,
                    {
                      userName,
                      password,
                    }
                  );

                  localStorage.setItem("token", response.data.token);

                  notifySuccess(
                    response.data.message || "Welcome to Dashboard!"
                  );

                  navigate("/dashboard");
                } catch (error) {
                  notifyError(
                    error.response?.data?.message || "Invalid credentials!"
                  );
                }
              }}
              label={"Sign in"}
            />
          </div>
          <BottomWarning
            label={"Don't have an account?"}
            buttonText={"Sign up"}
            to={"/signup"}
          />
        </div>
      </div>
    </div>
  );
};
