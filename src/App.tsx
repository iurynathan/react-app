import { router } from '@/routes';
import { Switch, Text, Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import { useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import './index.css';

export const App: React.FC = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <Theme
      appearance={theme}
      radius="large"
      scaling="95%"
      className="w-screen"
    >
      <Text as="label" size="2" className="absolute top-2 right-2">
        <Switch size="1" onCheckedChange={toggleTheme} checked={theme === "light"} /> {theme === "light" ? "Light" : "Dark"} Mode
      </Text>
      <RouterProvider router={router} />
    </Theme>
  );
};
