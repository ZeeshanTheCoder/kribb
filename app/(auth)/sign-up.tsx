import { useAuth, useSignUp } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function SignUp() {

  const { signUp, errors, fetchStatus } = useSignUp();

  const { isSignedIn } = useAuth();

  const router = useRouter();

  const [isVerifying, setIsVerifying] = React.useState(false);

  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");

  const isLoading = fetchStatus === "fetching";

  if (signUp.status === "complete" || isSignedIn) {
    return null;
  }

  const onSignUpProcess = async () => {
    const { error } = await signUp.password({
      emailAddress: email,
      password,
      firstName,
      lastName

    })

    if (error) {
      alert(error.message)
      // console.log(JSON.stringify(error, null, 2))
      return;
    }

    if (!error) await signUp.verifications.sendEmailCode();

    setIsVerifying(true);
  }

  const onVerifyProcess = async () => {
    await signUp.verifications.verifyEmailCode({ code });

    if (signUp.status === "complete") {
      await signUp.finalize({
        navigate: ({ decorateUrl }) => {
          const url = decorateUrl("/");
          router.replace(url as any)
        }
      })
    }

  }
  

  if (
    isVerifying &&
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0) {
    return (
      <View className="flex-1 justify-center px-6 py-12">
        <Image
          source={require('../../assets/images/kribb.png')}
          className="w-32 h-16 mb-8" resizeMode="contain"
        />
        <Text className="text-gray-800 mb-2 text-3xl font-bold">
          Create account
        </Text>
        <Text className="text-gray-800 mb-8">
          Find your dream home today
        </Text>

        {/* Verification Code */}
        <TextInput
          className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4"
          placeholder="Enter Verification Code"
          placeholderTextColor="#9CA3AF"
          value={code}
          onChangeText={setCode}
        />

        {
          errors.fields.code && (
            <Text className="text-red-500 mb-4">
              {errors.fields.code.message}
            </Text>
          )
        }

        {/* Verify Btn */}
        <TouchableOpacity
          onPress={onVerifyProcess}
          disabled={isLoading}
          className="w-full bg-blue-600 py-4 rounded-xl mb-4 items-center"
        >
          {isLoading ? <ActivityIndicator size="small" color="white" />
            : <Text className="text-white font-bold text-base">Verify </Text>
          }
        </TouchableOpacity>

        {/* Need new code */}

        <TouchableOpacity
          onPress={() => signUp.verifications.sendEmailCode()}
          className="py-2"
        >
          <Text className="text-blue-600">I need a new code </Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      className="bg-white"
      keyboardShouldPersistTaps="handled"
    >
      <View className="flex-1 justify-center px-6 py-12">
        <Image
          source={require('../../assets/images/kribb.png')}
          className="w-32 h-16 mb-8" resizeMode="contain"
        />
        <Text className="text-gray-800 mb-2 text-3xl font-bold">
          Create account
        </Text>
        <Text className="text-gray-800 mb-8">
          Find your dream home today
        </Text>

        <View className="flex-row gap-3 mb-4">
          {/* First Name */}
          <TextInput
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3"
            placeholder="First Name"
            placeholderTextColor="#9CA3AF"
            value={firstName}
            onChangeText={setFirstName}
            autoCapitalize="words"
          />

          {/* Last Name */}
          <TextInput
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3"
            placeholder="Last Name"
            placeholderTextColor="#9CA3AF"
            value={lastName}
            onChangeText={setLastName}
            autoCapitalize="words"
          />
        </View>

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

        {errors.fields.emailAddress && (
          <Text className="text-red-500 mb-1">
            {errors.fields.emailAddress.message}
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

        {/* Button */}
        <TouchableOpacity
          onPress={onSignUpProcess}
          className="w-full mt-4 bg-blue-600 py-4 rounded-xl mb-4 items-center" disabled={isLoading} >
          {
            isLoading ? <ActivityIndicator size="small" color="white" />
              : <Text className="text-white font-bold text-base">Sign Up</Text>
          }
        </TouchableOpacity>

        {/* Already have an account? */}
        <View className="flex-row justify-center">
          <Text className="text-gray-500">
            Already have an account? {""}
            <Link href='/sign-in'>
              <Text className="text-blue-600 font-semibold" >
                Sign In
              </Text></Link>
          </Text>
        </View>

        {/* clerk captcha */}
        <View nativeID="clerk-captcha" />

      </View>
    </ScrollView>
  );
}
