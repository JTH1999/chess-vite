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
    ChangeEvent,
    ChangeEventHandler,
    FormEvent,
    FormEventHandler,
    useContext,
    useEffect,
    useState,
} from "react";
import { Form, redirect, useNavigate } from "react-router-dom";
import bgImage from "../assets/GreenPiecesNoLogo.png";
import MainButton from "../components/MainButton";
import { UserContext } from "../context/UserContext";
import { useAuth } from "../hooks/useAuth";

async function loginUser(credentials) {
    return fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    }).then((data) => data.json());
}

export default function Login() {
    // const [searchParams] = useSearchParams();
    const [value, setValue] = useState("Login");
    const [show, setShow] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [userContext, setUserContext] = useContext(UserContext);
    const handlePasswordShowClick = () => setShow(!show);
    const auth = useAuth();
    const navigate = useNavigate();

    // redirect to home if user is already logged in
    useEffect(() => {
        const getUser = async () => {
            const user = await auth.getUser();
            if (user) {
                return navigate("/");
            }
        };
        const test = getUser();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        const genericErrorMessage =
            "Something went wrong! Please try again later.";
        console.log(e.target.loginType.value);

        if (e.target.loginType.value === "Login") {
            const signInSuccessful: boolean = await auth.signin(
                e.target.username.value,
                e.target.password.value,
                setIsSubmitting,
                setError,
                genericErrorMessage
            );
            if (signInSuccessful) {
                return navigate("/");
            } else {
                setIsSubmitting(false);
            }
        } else if (e.target.loginType.value === "Register") {
            const signupSuccessful = await auth.signup(
                e.target.username.value,
                e.target.password.value,
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

    return (
        <Box
            bgImage={bgImage}
            height="100vh"
            objectFit={"cover"}
            bgRepeat="no-repeat"
            pt="40"
            w="100vw"
        >
            {/* <Image src={bgImage} objectFit="contain" /> */}
            <Flex justify={"center"}>
                <Flex
                    p="10"
                    bg="gray.900"
                    direction="column"
                    textAlign={"center"}
                    borderRadius="16px"
                    boxShadow={"xl"}
                >
                    <Heading pb="4">Login</Heading>
                    <form method="post" onSubmit={handleSubmit}>
                        <Stack spacing="5" textAlign={"left"}>
                            {/* <Input
                                type="hidden"
                                name="redirectTo"
                                value={
                                    searchParams.get("redirectTo") ?? undefined
                                }
                            /> */}
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
                                        <Radio
                                            value="Register"
                                            name="loginType"
                                        >
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
                            >
                                {`${isSubmitting ? "Signing In" : "Sign In"}`}
                            </Button>
                        </Stack>
                    </form>
                    {/* <Text pt="8" color="blue.500">
                        <Link to="/">Home</Link>
                    </Text> */}
                </Flex>
            </Flex>
        </Box>
    );
}
