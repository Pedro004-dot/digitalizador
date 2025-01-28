'use client';
import { useDispatch } from "react-redux";
import { protectedAction } from "../store/actions";

export default function TestMiddleware() {
  const dispatch = useDispatch();

  const testProtectedAction = () => {
    dispatch(protectedAction({ prefeituraId: "cm615suu900008ofn5ndryc05" }));
  };

  return (
    <button onClick={testProtectedAction} className="bg-blue-600 text-white p-2 rounded">
      Test Protected Action
    </button>
  );
}