import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import React, { Component } from "react";
import { StyleSheet, Text, View, Button, TouchableOpacity } from "react-native";

const Stack = createStackNavigator();

class NavButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: props.text,
      navigation: props.nav,
      navigateTo: props.navigateTo,
    };
  }

  render() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.navButtonContainer}
        onPress={() => this.state.navigation.navigate(this.state.navigateTo)}
      >
        <Text style={styles.navButtonText}>{this.state.text}</Text>
      </TouchableOpacity>
    );
  }
}

function HomePage({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Yo-cart!</Text>
      <NavButton
        text="Grocery List"
        nav={navigation}
        navigateTo="Grocery List"
      />
      <NavButton text="Recipes" nav={navigation} navigateTo="Recipes" />
      <NavButton text="Inventory" nav={navigation} navigateTo="Inventory" />
      <NavButton text="Settings" nav={navigation} navigateTo="Settings" />
      <StatusBar style="auto" />
    </View>
  );
}

function GroceryPage({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Grocery List</Text>
      <NavButton text="Back Home" nav={navigation} navigateTo="Home" />
    </View>
  );
}

function RecipePage({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Recipes</Text>
      <NavButton text="Back Home" nav={navigation} navigateTo="Home" />
    </View>
  );
}

function InventoryPage({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Inventory</Text>
      <NavButton text="Back Home" nav={navigation} navigateTo="Home" />
    </View>
  );
}

function SettingsPage({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Settings</Text>
      <NavButton text="Back Home" nav={navigation} navigateTo="Home" />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomePage} />
        <Stack.Screen name="Grocery List" component={GroceryPage} />
        <Stack.Screen name="Recipes" component={RecipePage} />
        <Stack.Screen name="Inventory" component={InventoryPage} />
        <Stack.Screen name="Settings" component={SettingsPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  titleText: {
    fontSize: 70,
    fontWeight: "bold",
    marginBottom: 30,
    fontFamily: "Noteworthy",
  },
  navButtonContainer: {
    elevation: 8,
    backgroundColor: "#da96e7",
    borderRadius: 30,
    height: 100,
    width: 300,
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  navButtonText: {
    fontSize: 30,
    fontFamily: "Noteworthy",
    color: "#fff",
  },
});
