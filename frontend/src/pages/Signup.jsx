import { BottomWarning } from "../components/ButtonWarning";
import { Button } from "../components/Button";
import { Heading } from "../components/HeaderBar";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { notifySuccess, notifyError } from "../utils/Toast";
import { API_URL } from "../Config/config";


export const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label={"Sign up"} />
          <SubHeading label={"Enter your infromation to create an account"} />
          <InputBox
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="John"
            label={"First Name"}
          />
          <InputBox
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Doe"
            label={"Last Name"}
          />
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
                    `${API_URL}/api/v1/user/signup`,
                    {
                      userName,
                      firstName,
                      lastName,
                      password,
                    }
                  );

                  localStorage.setItem("token", response.data.token);
                  notifySuccess(response.data.message || "Signup successful!");
                  navigate("/dashboard");
                } catch (error) {
                  notifyError(
                    error.response?.data?.message || "Something went wrong!"
                  );
                }
              }}
              label={"Sign up"}
            />
          </div>
          <BottomWarning
            label={"Already have an account?"}
            buttonText={"Sign in"}
            to={"/signin"}
          />
        </div>
      </div>
    </div>
  );
};
