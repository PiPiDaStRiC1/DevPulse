import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiClient } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { loginSchema, registerSchema } from "@shared/schemas";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import type { LoginSchema, RegisterSchema } from "@shared/schemas";

export const useAuth = () => {
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);

    const {
        register: registerLogin,
        formState: { errors: loginErrors, isValid: isLoginValid },
        handleSubmit: handleLoginSubmit,
    } = useForm<LoginSchema>({ resolver: zodResolver(loginSchema), mode: "onChange" });

    const {
        register: registerRegister,
        formState: { errors: registerErrors, isValid: isRegisterValid },
        handleSubmit: handleRegisterSubmit,
    } = useForm<RegisterSchema>({ resolver: zodResolver(registerSchema), mode: "onChange" });

    const submitForm = async (data: LoginSchema | RegisterSchema) => {
        try {
            if ("confirmPassword" in data) {
                // eslint-disable-next-line
                const { confirmPassword: _, ...userData } = data;

                const authData = await apiClient.register(userData);
                setAuth({ token: authData.token, user: authData.user });
                toast.success("Registration successfull!");
            } else {
                const authData = await apiClient.login(data);
                setAuth({ token: authData.token, user: authData.user });
                toast.success("Login successfull!");
            }

            navigate("/profile");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Authentication failed");
        }
    };

    return {
        submitForm,
        login: { registerLogin, loginErrors, isLoginValid, handleLoginSubmit },
        register: { registerRegister, registerErrors, isRegisterValid, handleRegisterSubmit },
    };
};
