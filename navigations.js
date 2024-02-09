import { NavigationRef } from '@react-navigation/native';

export const setTopLevelNavigator = (navigatorRef) => {
  NavigationRef.current = navigatorRef;
};

export const navigate = (routeName, params) => {
  NavigationRef.current?.navigate(routeName, params);
};