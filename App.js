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
  ActivityIndicator,
  Button,
  TextInput,
} from "react-native";
import { groceryList, inventoryList } from "./data.json";

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

class RecipesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      dataSource: [],
      searchText: "",
      navigation: props.nav,
      navigateTo: props.navigateTo,
    };
  }

  handleSearch = (text) => {
    this.setState({ searchText: text });
  };

  goForFetch = () => {
    this.setState({
      loading: true,
    });
    fetch(
      "https://www.themealdb.com/api/json/v1/1/search.php?s=" +
        this.state.searchText
    )
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("getting data from fetch", responseJson);
        setTimeout(() => {
          this.setState({
            loading: false,
            dataSource: responseJson,
          });
        }, 1000);
      })
      .catch((error) => console.log(error));
  };

  FlatListSeparator = () => {
    return (
      <View
        style={{
          height: 0.5,
          width: "100%",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      />
    );
  };

  render() {
    return (
      <View>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Search"
            onChangeText={this.handleSearch}
          />
          <TouchableOpacity
            style={styles.fetchButton}
            onPress={this.goForFetch}
          >
            <Text style={styles.fetchButtonText}>Fetch</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.itemContainer}>
          {this.state.loading && (
            <View>
              <ActivityIndicator size="small" color="#0c9" />
            </View>
          )}
          <FlatList
            data={this.state.dataSource.meals}
            ItemSeparatorComponent={this.FlatListSeparator}
            renderItem={(data) => (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() =>
                  this.state.navigation.navigate(this.state.navigateTo, {
                    data: data,
                  })
                }
              >
                <Text style={styles.itemText}>{data.item.strMeal}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.idMeal.toString()}
          />
        </View>
      </View>
    );
  }
}

function Recipe({ navigation, route }) {
  return (
    <View style={styles.container}>
      <Text style={styles.subHeaderText}>{route.params.data.item.strMeal}</Text>
      <Text>{route.params.data.item.strInstructions}</Text>
      <NavButton text="Back To Recipes" nav={navigation} navigateTo="Recipes" />
    </View>
  );
}

function GroceryPage({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.subHeaderText}>Grocery List</Text>
      <List data={groceryList} />
      <NavButton text="Back Home" nav={navigation} navigateTo="Home" />
    </View>
  );
}

function RecipePage({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.subHeaderText}>Recipes</Text>
      <RecipesList nav={navigation} navigateTo="SingleRecipe" />
      <NavButton text="Back Home" nav={navigation} navigateTo="Home" />
    </View>
  );
}

function InventoryPage({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.subHeaderText}>Inventory</Text>
      <List data={inventoryList} />
      <NavButton text="Back Home" nav={navigation} navigateTo="Home" />
    </View>
  );
}

function SettingsPage({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.subHeaderText}>Settings</Text>
      <NavButton text="Back Home" nav={navigation} navigateTo="Home" />
    </View>
  );
}

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomePage} />
        <Stack.Screen name="Grocery List" component={GroceryPage} />
        <Stack.Screen name="Recipes" component={RecipePage} />
        <Stack.Screen name="Inventory" component={InventoryPage} />
        <Stack.Screen name="Settings" component={SettingsPage} />
        <Stack.Screen name="SingleRecipe" component={Recipe} />
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
    padding: 20,
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
    justifyContent: "center",
    borderRadius: 20,
    width: 300,
    height: 400,
    borderWidth: 3,
    padding: 10,
  },
  itemText: {
    fontSize: 30,
  },
  textInput: {
    fontSize: 30,
    borderWidth: 3,
    padding: 10,
    borderRadius: 20,
    width: 230,
  },
  searchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: 300,
    marginBottom: 5,
    height: 50,
  },
  fetchButton: {
    elevation: 8,
    backgroundColor: "#da96e7",
    borderRadius: 10,
    height: 50,
    width: 65,
    marginLeft: 5,
    padding: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fetchButtonText: {
    fontSize: 20,
    color: "#fff",
  },
});
