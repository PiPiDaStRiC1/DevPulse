import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiClient } from "@/lib/api";
import { loginSchema, registerSchema } from "@shared/schemas";
import type { LoginSchema, RegisterSchema } from "@shared/schemas";

export const useAuth = () => {
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
        if ("confirmPassword" in data) {
            // eslint-disable-next-line
            const { confirmPassword: _, ...userData } = data;

            await apiClient.register(userData);
        } else {
            await apiClient.login(data);
        }
    };

    return {
        submitForm,
        login: { registerLogin, loginErrors, isLoginValid, handleLoginSubmit },
        register: { registerRegister, registerErrors, isRegisterValid, handleRegisterSubmit },
    };
};
