import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";

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

const DATA = [
  {
    id: "0",
    title: "Milk",
  },
  {
    id: "1",
    title: "Cereal",
  },
];

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
    };
  }

  render() {
    return (
      <View style={styles.itemContainer}>
        <FlatList
          data={this.state.data}
          renderItem={({ item }) => (
            <View>
              <Text style={styles.itemText}>{item.title}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
    );
  }
}

function GroceryPage({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.subHeaderText}>Grocery List</Text>
      <List data={DATA} />
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
  subHeaderText: {
    fontSize: 50,
    marginBottom: 20,
    fontFamily: "Noteworthy",
  },
  itemContainer: {
    flex: 1,
    justifyContent: "center",
    borderRadius: 20,
    width: 300,
    borderWidth: 3,
    padding: 10,
  },
  itemText: {
    fontSize: 30,
  },
});
