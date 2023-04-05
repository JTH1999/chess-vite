import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Radio,
  RadioGroup,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  FormEvent,
  FormEventHandler,
  SyntheticEvent,
  useContext,
  useEffect,
  useState,
} from "react";
import { Form, Link, redirect, useNavigate } from "react-router-dom";
import bgImage from "../assets/GreenPiecesNoLogo.png";
import MainButton from "../components/MainButton";

import { useAuth } from "../hooks/useAuth";
import { useColour } from "../hooks/useColour";

export default function Login() {
  const [value, setValue] = useState("Login");
  const [show, setShow] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handlePasswordShowClick = () => setShow(!show);
  const auth = useAuth()!;
  const navigate = useNavigate();
  const { colourScheme } = useColour();

  // redirect to home if user is already logged in
  useEffect(() => {
    const getUser = async () => {
      const user = await auth.getUser();
      if (user) {
        return navigate("/");
      }
    };
  }, []);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const genericErrorMessage = "Something went wrong! Please try again later.";
    const target = e.target as typeof e.target & {
      username: { value: string };
      password: { value: string };
      loginType: { value: string };
    };

    if (target.loginType.value === "Login") {
      const signInSuccessful: boolean = await auth.signin(
        target.username.value,
        target.password.value,
        setIsSubmitting,
        setError,
        genericErrorMessage
      );
      if (signInSuccessful) {
        return navigate("/");
      } else {
        setIsSubmitting(false);
      }
    } else if (target.loginType.value === "Register") {
      const signupSuccessful = await auth.signup(
        target.username.value,
        target.password.value,
        setIsSubmitting,
        setError,
        genericErrorMessage
      );

      if (signupSuccessful) {
        return navigate("/");
      } else {
        setIsSubmitting(false);
      }
    }
  };

  console.log(value);

  return (
    <Box bgImage={bgImage} height="100vh" bgSize="cover" pt="40">
      <Flex justify={"center"}>
        <Flex
          p="10"
          bg={colourScheme.body}
          direction="column"
          textAlign={"center"}
          borderRadius="16px"
          boxShadow={"xl"}
        >
          <Heading pb="4">Login</Heading>
          <form method="post" onSubmit={handleSubmit}>
            <Stack spacing="5" textAlign={"left"}>
              <Flex justify={"center"}>
                <RadioGroup
                  onChange={setValue}
                  value={value}
                  colorScheme="green"
                >
                  <Stack direction="row" spacing="8">
                    <Radio value="Login" name="loginType">
                      Login
                    </Radio>
                    <Radio value="Register" name="loginType">
                      Register
                    </Radio>
                  </Stack>
                </RadioGroup>
              </Flex>
              {error && <Text color="red">{error}</Text>}
              <Box>
                <Text pb="4px">Username</Text>
                <Input
                  name="username"
                  // defaultValue={actionData?.fields?.username}
                  // isInvalid={Boolean(
                  //     responseUsernameError || usernameError
                  // )}
                  // aria-invalid={
                  //     Boolean(usernameError) || undefined
                  // }
                  // aria-errormessage={
                  //     usernameError != ""
                  //         ? "username-error"
                  //         : undefined
                  // }
                  // onChange={handleUsernameChange}
                />
                {/* <Text>{responseUsernameError}</Text>
                            {usernameError != "" ? (
                                <Text color={"red.500"} role="alert">
                                    {usernameError}
                                </Text>
                            ) : null} */}
              </Box>
              <Box>
                <Text pb="4px">Password</Text>
                <InputGroup size="md">
                  <Input
                    pr="4.5rem"
                    type={show ? "text" : "password"}
                    placeholder="Enter password"
                    name="password"
                    onChange={() => {}}
                    isInvalid={false}
                  />
                  <InputRightElement width="4.5rem">
                    <Button
                      h="1.75rem"
                      size="sm"
                      onClick={handlePasswordShowClick}
                    >
                      {show ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                {/* {passwordError != "" ? (
                                <Text color={"red.500"} role="alert">
                                    {passwordError}
                                </Text>
                            ) : null} */}
              </Box>

              <Button
                bgColor={"green.400"}
                color="white"
                type="submit"
                mt="20px"
                _hover={{ backgroundColor: "green.400" }}
              >
                {isSubmitting && value === "Login"
                  ? "Signing In"
                  : isSubmitting && value === "Register"
                  ? "Creating account"
                  : value === "Register"
                  ? "Create Account"
                  : "Sign In"}
              </Button>
              <Text
                pt="8"
                color="green.400"
                textAlign={"center"}
                _hover={{ textDecor: "underline" }}
              >
                <Link to="/">Continue without logging in</Link>
              </Text>
            </Stack>
          </form>
          {/*  */}
        </Flex>
      </Flex>
    </Box>
  );
}
