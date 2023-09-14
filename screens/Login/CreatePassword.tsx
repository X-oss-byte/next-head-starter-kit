import React, { useState } from 'react';
import {
  VStack,
  Box,
  HStack,
  Icon,
  Text,
  Button,
  Center,
  ArrowLeftIcon,
  FormControl,
  Heading,
  FormControlHelperText,
  EyeIcon,
  EyeOffIcon,
  ButtonText,
  Input,
  useToast,
  Toast,
  InputField,
  ToastTitle,
  FormControlHelper,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  InputIcon,
  Link,
} from '@gluestack-ui/themed';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Keyboard } from 'react-native';

import { AlertTriangle } from 'lucide-react-native';

import GuestLayout from '../../layouts/GuestLayout';

import Image from '../../components/StyledImage';

import { useRouter } from 'next/navigation';


const createPasswordSchema = z.object({
  password: z
    .string()
    .min(6, 'Must be at least 8 characters in length')
    .regex(new RegExp('.*[A-Z].*'), 'One uppercase character')
    .regex(new RegExp('.*[a-z].*'), 'One lowercase character')
    .regex(new RegExp('.*\\d.*'), 'One number')
    .regex(
      new RegExp('.*[`~<>?,./!@#$%^&*()\\-_+="\'|{}\\[\\];:\\\\].*'),
      'One special character'
    ),
  confirmpassword: z
    .string()
    .min(6, 'Must be at least 8 characters in length')
    .regex(new RegExp('.*[A-Z].*'), 'One uppercase character')
    .regex(new RegExp('.*[a-z].*'), 'One lowercase character')
    .regex(new RegExp('.*\\d.*'), 'One number')
    .regex(
      new RegExp('.*[`~<>?,./!@#$%^&*()\\-_+="\'|{}\\[\\];:\\\\].*'),
      'One special character'
    ),
});

type CreatePasswordSchemaType = z.infer<typeof createPasswordSchema>;

export default function CreatePassword() {
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<CreatePasswordSchemaType>({
    resolver: zodResolver(createPasswordSchema),
  });

  const router = useRouter();  
  const toast = useToast();

  const onSubmit = (data: CreatePasswordSchemaType) => {
    if (data.password === data.confirmpassword) {
      // Implement your own onSubmit logic and navigation logic here.
      router.replace('/login');

      toast.show({
        placement: 'bottom right',
        render: ({ id }) => {
          return (
            <Toast nativeID={id} variant="accent" action="success">
              <ToastTitle>Passwords matched, update successful</ToastTitle>
            </Toast>
          );
        },
      });
    } else {
      toast.show({
        placement: 'bottom right',
        render: ({ id }) => {
          return (
            <Toast nativeID={id} variant="accent" action="error">
              <ToastTitle>Passwords do not match</ToastTitle>
            </Toast>
          );
        },
      });
    }

    // reset();
  };

  const handleKeyPress = () => {
    Keyboard.dismiss();
    handleSubmit(onSubmit)();
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleState = () => {
    setShowPassword((showState) => {
      return !showState;
    });
  };

  const handleConfirmPasswordState = () => {
    setShowConfirmPassword((showConfirmPassword) => {
      return !showConfirmPassword;
    });
  };

  function Header() {
    return (
      <HStack space="md" px="$3" my="$4.5" alignItems="center">
        <Link>
          <Icon size="md" as={ArrowLeftIcon} color="$textLight50" />
        </Link>
        <Text color="$textLight50" fontSize="$lg">
          Create Password
        </Text>
      </HStack>
    );
  }

  function ScreenText() {
    return (
      <VStack space="md">
        <Heading
          fontSize="$xl"
          color="$textLight800"
          sx={{
            '@md': { fontSize: '$2xl' },

            '_dark': { color: '$textDark50' },
          }}
        >
          Create new password
        </Heading>
        <Text
          color="$textLight800"
          fontSize="$sm"
          sx={{
            _dark: { color: '$textDark400' },
          }}
        >
          Your new password must be different from previous used passwords and
          must be of at least 8 characters.
        </Text>
      </VStack>
    );
  }

  function WebSideContainer() {
    return (
      <Center
        flex={1}
        bg="$primary500"
        px="$4"
        sx={{
          '@md': { px: '$8' },
        }}
      >
        <Image
          w="$80"
          h="$10"
          alt="gluestack-ui Pro"
          src={require('./assets/images/gluestackUiProLogo_web_light.svg')}
        />
      </Center>
    );
  }
  return (
    <GuestLayout>
      <Box
        sx={{
          '@md': { display: 'none' },
        }}
      >
        <Header />
      </Box>
      <Box
        display="none"
        sx={{
          '@md': { display: 'flex' },
        }}
        flex={1}
      >
        <WebSideContainer />
      </Box>
      <Box
        bg="$backgroundLight0"
        pt="$8"
        pb="$4"
        px="$4"
        sx={{
          '@md': {
            p: '$8',
          },
          '_dark': { bg: '$backgroundDark800' },
        }}
        flex={1}
      >
        <Box flex={1}>
          <ScreenText />
          <VStack
            mt="$7"
            space="md"
            sx={{
              '@md': { mt: '$8' },
            }}
          >
            <Box sx={{ '@base': { w: '$full' }, '@md': { width: '$80' } }}>
              <FormControl isInvalid={!!errors.password} isRequired={true}>
                <Controller
                  defaultValue=""
                  name="password"
                  control={control}
                  rules={{
                    validate: async (value) => {
                      try {
                        await createPasswordSchema.parseAsync({
                          password: value,
                        });
                        return true;
                      } catch (error: any) {
                        return error.message;
                      }
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input>
                      <InputField
                        fontSize="$sm"
                        placeholder="Password"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        onSubmitEditing={handleKeyPress}
                        returnKeyType="done"
                        type={showPassword ? 'text' : 'password'}
                      />
                      <InputIcon onPress={handleState} mr="$2">
                        <Icon
                          as={showPassword ? EyeIcon : EyeOffIcon}
                          color="gray"
                        />
                      </InputIcon>
                    </Input>
                  )}
                />
                <FormControlError>
                  <FormControlErrorIcon as={AlertTriangle} size="md" />
                  <FormControlErrorText>
                    {errors?.password?.message}
                  </FormControlErrorText>
                </FormControlError>
                <FormControlHelperText>
                  <Text size="xs">Must be at least 8 characters</Text>
                </FormControlHelperText>
                <FormControlHelper></FormControlHelper>
              </FormControl>
            </Box>

            <Box
              sx={{
                '@base': { w: '$full' },
                '@md': { width: '$80', mt: '$28' },
              }}
            >
              <FormControl
                isInvalid={!!errors.confirmpassword}
                isRequired={true}
              >
                <Controller
                  defaultValue=""
                  name="confirmpassword"
                  control={control}
                  rules={{
                    validate: async (value) => {
                      try {
                        await createPasswordSchema.parseAsync({
                          confirmpassword: value,
                        });
                        return true;
                      } catch (error: any) {
                        return error.message;
                      }
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input>
                      <InputField
                        fontSize="$sm"
                        placeholder="Confirm Password"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        onSubmitEditing={handleKeyPress}
                        returnKeyType="done"
                        type={showConfirmPassword ? 'text' : 'password'}
                      />
                      <InputIcon onPress={handleConfirmPasswordState} mr="$2">
                        <Icon
                          as={showConfirmPassword ? EyeIcon : EyeOffIcon}
                          color="gray"
                        />
                      </InputIcon>
                    </Input>
                  )}
                />

                <FormControlError>
                  <FormControlErrorIcon as={AlertTriangle} size="md" />
                  <FormControlErrorText>
                    {errors?.confirmpassword?.message}
                  </FormControlErrorText>
                </FormControlError>
                <FormControlHelperText>
                  <Text size="xs"> Both Password must match</Text>
                </FormControlHelperText>
                <FormControlErrorText>
                  {/* {errors.password && errors.password.message !== '' && ( */}
                  <Text size="xs">{errors.confirmpassword?.message}</Text>
                  {/* )} */}
                </FormControlErrorText>
              </FormControl>
            </Box>
          </VStack>
        </Box>
        <Button
          variant="solid"
          size="lg"
          mt="auto"
          sx={{ '@md': { mt: '$40' } }}
          onPress={handleSubmit(onSubmit)}
        >
          <ButtonText fontSize="$sm">UPDATE PASSWORD</ButtonText>
        </Button>
      </Box>
    </GuestLayout>
  );
}
