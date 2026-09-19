import { useSignIn } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignIn() {
  const { signIn, errors, fetchStatus } = useSignIn();

  const router = useRouter();

  const [isVerifying, setIsVerifying] = React.useState(false);

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");

  const isLoading = fetchStatus === "fetching";

  const onSignInProcess = async () => {
    const { error } = await signIn.password({
      emailAddress: email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            console.log(session.currentTask);
            return;
          }

          const url = decorateUrl("/");
          router.replace(url as any);
        },
      });

      return;
    }

    if (signIn.status === "needs_second_factor") {
      await signIn.mfa.sendPhoneCode();
      setIsVerifying(true);
      return;
    }

    if (signIn.status === "needs_client_trust") {
      const emailCodeFactor = signIn.supportedSecondFactors.find(
        (factor) => factor.strategy === "email_code"
      );

      if (emailCodeFactor) {
        await signIn.mfa.sendEmailCode();
        setIsVerifying(true);
      }

      return;
    }

    console.log("Sign-in attempt not complete", signIn);
  };

  const onVerifyProcess = async () => {
    const { error } = await signIn.mfa.verifyEmailCode({
      code,
    });

    if (error) {
      alert(error.message);
      return;
    }

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            console.log(session.currentTask);
            return;
          }

          const url = decorateUrl("/");
          router.replace(url as any);
        },
      });
    }
  };

  // Verification screen
  if (isVerifying && signIn.status === "needs_client_trust") {
    return (
      <View className="flex-1 justify-center px-6 py-12 bg-white">
        <Image
          source={require("../../assets/images/kribb.png")}
          className="w-32 h-16 mb-8"
          resizeMode="contain"
        />

        <Text className="text-gray-800 mb-2 text-3xl font-bold">
          Verify your account
        </Text>

        <Text className="text-gray-800 mb-8">
          Enter the verification code sent to your email
        </Text>

        <TextInput
          className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4"
          placeholder="Enter Verification Code"
          placeholderTextColor="#9CA3AF"
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
        />

        {errors.fields.code && (
          <Text className="text-red-500 mb-4">
            {errors.fields.code.message}
          </Text>
        )}

        <TouchableOpacity
          onPress={onVerifyProcess}
          disabled={isLoading}
          className="w-full bg-blue-600 py-4 rounded-xl mb-4 items-center"
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text className="text-white font-bold text-base">
              Verify
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => signIn.mfa.sendEmailCode()}
          className="py-2"
        >
          <Text className="text-blue-600 text-center">
            I need a new code
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Normal sign-in screen
  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      className="bg-white"
      keyboardShouldPersistTaps="handled"
    >
      <View className="flex-1 justify-center px-6 py-12">
        <Image
          source={require("../../assets/images/kribb.png")}
          className="w-32 h-16 mb-8"
          resizeMode="contain"
        />

        <Text className="text-gray-800 mb-2 text-3xl font-bold">
          Welcome Back
        </Text>

        <Text className="text-gray-800 mb-8">
          Sign in to your account
        </Text>

        {/* Email */}
        <TextInput
          className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-2"
          placeholder="Email Address"
          placeholderTextColor="#9CA3AF"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {errors.fields.identifier && (
          <Text className="text-red-500 mb-1">
            {errors.fields.identifier.message}
          </Text>
        )}

        {/* Password */}
        <TextInput
          className="w-full border border-gray-300 rounded-xl px-4 py-3 mt-2 mb-2"
          placeholder="Password"
          placeholderTextColor="#9CA3AF"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {errors.fields.password && (
          <Text className="text-red-500">
            {errors.fields.password.message}
          </Text>
        )}

        {/* Sign In Button */}
        <TouchableOpacity
          onPress={onSignInProcess}
          disabled={isLoading}
          className="w-full mt-4 bg-blue-600 py-4 rounded-xl mb-4 items-center"
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text className="text-white font-bold text-base">
              Sign In
            </Text>
          )}
        </TouchableOpacity>

        {/* Sign Up */}
        <View className="flex-row justify-center">
          <Text className="text-gray-500">
            Don't have an account?{" "}
            <Link href="/sign-up">
              <Text className="text-blue-600 font-semibold">
                Sign Up
              </Text>
            </Link>
          </Text>
        </View>

        {/* Clerk Captcha */}
        <View nativeID="clerk-captcha" />
      </View>
    </ScrollView>
  );
}
