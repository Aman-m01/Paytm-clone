import { useEffect, useState, useCallback } from "react";
import { Appbar } from "../components/AppBar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { notifyError } from "../utils/Toast";
import { API_URL } from "../Config/config";

export const Dashboard = () => {
  const [balance, setBalance] = useState(0);
  const navigate = useNavigate();

  const fetchBalance = useCallback(async () => {
    const userToken = localStorage.getItem("token");

    if (!userToken) {
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/api/v1/account/balance`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      setBalance(response.data.balance);
    } catch (error) {
      if (error.response?.status === 401) {
        notifyError("Unauthorized");
        
        navigate("/login"); // Unauthorized → Redirect to login
      } else {
        navigate("/signup"); // Other errors → Redirect to signup
      }
    }
  }, [navigate]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return (
    <div>
      <Appbar />
      <div className="m-8">
        <Balance value={balance} />
        <Users />
      </div>
    </div>
  );
};
