import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Card, Flex, Text, TextField } from '@radix-ui/themes';
import Cookies from 'js-cookie';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

const loginFormSchema = z.object({
  email: z.string({ required_error: 'O e-mail é obrigatório' }).email('E-mail inválido'),
  password: z.string({ required_error: 'A senha é obrigatória' }).min(8, { message: 'A senha deve ter pelo menos 8 caracteres' }),
});

type LoginFormData = z.infer<typeof loginFormSchema>;

const fakeFetch = (data: LoginFormData) => {
  return new Promise<{ token?: string; message?: string }>((resolve) => {
    setTimeout(() => {
      
      if (data.email === 'test@example.com' && data.password === 'password123') {
        resolve({ token: 'fake-jwt-token' });
      } else {
        resolve({ message: 'Credenciais inválidas' });
      }
    }, 1000); 
  });
};

export const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const updateRemainingTime = () => {
      const restriction = Cookies.get('login_restriction');
      if (restriction) {
        const restrictionDate = new Date(restriction);
        const now = new Date();
        if (restrictionDate > now) {
          const timeLeft = Math.ceil((restrictionDate.getTime() - now.getTime()) / 1000);
          setRemainingTime(timeLeft);
          setErrorMessage(`Tente novamente em ${timeLeft % 60} segundos.`);
        } else {
          Cookies.remove('login_restriction');
          Cookies.remove('login_attempts');
          setRemainingTime(null);
          setErrorMessage(null);
        }
      }
    };

    updateRemainingTime();

    const interval = setInterval(updateRemainingTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (data: LoginFormData) => {
    try {
      const response = await fakeFetch(data);

      if (response.message) {
        setErrorMessage(response.message);

        const attempts = parseInt(Cookies.get('login_attempts') || '0', 10) + 1;
        Cookies.set('login_attempts', attempts.toString());

        if (attempts >= 5) {
          const restrictionDate = new Date();
          restrictionDate.setSeconds(restrictionDate.getSeconds() + 20);
          Cookies.set('login_restriction', restrictionDate.toISOString());
          setRemainingTime(20);
        }
      } else if (response.token) {
        const jwt = response.token;

        localStorage.setItem('jwt', jwt);
        setIsAuthenticated(true);

        Cookies.remove('login_attempts');
        Cookies.remove('login_restriction');
        setErrorMessage(null);
        setRemainingTime(null);
        navigate('/home')
      }
    } catch {
      setErrorMessage('Erro ao tentar se conectar com o servidor.');
    }
  };

  return (
    <Flex direction="column" align="center" justify="center" className="h-screen">
      <Box>
        <Card className="w-[350px] flex flex-col gap-4 p-6">
          <Flex align="center" justify="center">
            <Text as="div" size="8" weight="bold">
              Login
            </Text>
          </Flex>

          {errorMessage && (
            <Flex align="center" justify="center">
              <Text size="1" className="mt-1 text-red-400">
                {errorMessage}
              </Text>
            </Flex>
          )}

          {isAuthenticated && (
            <Flex align="center" justify="center">
              <Text size="1" className="mt-1 text-green-400">
                Autenticado
              </Text>
            </Flex>
          )}

          <Flex align="center" justify="center">
            <Box width="300px" className="flex flex-col gap-1">
              <Text as="label" size="2" weight="bold">
                Email
              </Text>
              <TextField.Root
                type="email"
                size="2"
                placeholder="Insira seu email"
                {...register('email')}
                aria-invalid={!!errors.email}
              />
              {!!errors.email && (
                <Text size="1" className="mt-1 text-red-400">
                  {errors.email?.message}
                </Text>
              )}
            </Box>
          </Flex>

          <Flex align="center" justify="center">
            <Box width="300px" className="flex flex-col gap-1">
              <Text as="label" size="2" weight="bold">
                Senha
              </Text>
              <TextField.Root
                size="2"
                type="password"
                placeholder="Insira sua senha"
                {...register('password')}
                aria-invalid={!!errors.password}
              />
              {!!errors.password && (
                <Text size="1" className="mt-1 text-red-400">
                  {errors.password?.message}
                </Text>
              )}
            </Box>
          </Flex>

          <Flex align="center" justify="center">
            <Button
              size="2"
              onClick={handleSubmit(handleLogin)}
              disabled={isSubmitting || !!remainingTime}
            >
              Entrar
              <ArrowRight />
            </Button>
          </Flex>
        </Card>
      </Box>
    </Flex>
  );
};
