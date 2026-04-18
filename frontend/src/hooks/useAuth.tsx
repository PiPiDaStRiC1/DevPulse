import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiClient } from "@/lib/api";
import { loginSchema, registerSchema } from "@shared/schemas";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import type { LoginSchema, RegisterSchema } from "@shared/schemas";

export const useAuth = () => {
    const navigate = useNavigate();

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

                // temporary solution to avoid zustand context for JWT token
                const { token } = await apiClient.register(userData);
                localStorage.setItem("access-token", JSON.stringify(token));
                toast.success("Registration successful!");
            } else {
                const { token } = await apiClient.login(data);
                localStorage.setItem("access-token", JSON.stringify(token));
                toast.success("Login successful!");
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
