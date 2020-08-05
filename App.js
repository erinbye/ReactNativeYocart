import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import React, { Component, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  TextInput,
  ScrollView,
  Alert,
  Button,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";

class NavButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: props.text,
      navigation: props.nav,
      navigateTo: props.navigateTo,
    };
  }

  onPress = () => {
    if (this.state.text == "Grocery List") {
      getData("@groceryList").then((response) =>
        this.state.navigation.navigate(this.state.navigateTo, {
          data: response,
        })
      );
    } else if (this.state.text == "Inventory") {
      getData("@inventoryList").then((response) =>
        this.state.navigation.navigate(this.state.navigateTo, {
          data: response,
        })
      );
    } else {
      this.state.navigation.navigate(this.state.navigateTo);
    }
    //clearAll();
  };

  render() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.navButtonContainer}
        onPress={this.onPress}
      >
        <Text style={styles.navButtonText}>{this.state.text}</Text>
      </TouchableOpacity>
    );
  }
}

function HomePage({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
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
    </SafeAreaView>
  );
}

const storeData = async (field, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(field, jsonValue);
  } catch (e) {
    console.log(e);
  }
};

const getData = async (field) => {
  try {
    const jsonValue = await AsyncStorage.getItem(field);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.log(e);
  }
};

const clearAll = async () => {
  try {
    await AsyncStorage.clear();
  } catch (e) {
    console.log(e);
  }
  console.log("Cleared.");
};

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      typeOfList: props.typeOfList,
      data: props.data,
      itemToAdd: "",
      itemAdded: false,
      refreshing: false,
    };
  }

  handleAdd = (text) => {
    this.setState({ itemToAdd: text });
  };

  addItem = () => {
    this.setState({ refreshing: true });

    getData(this.state.typeOfList).then((response) => {
      if (response == null) {
        const start = [
          {
            id: "0",
            title: this.state.itemToAdd,
          },
        ];
        storeData(this.state.typeOfList, start).then(
          this.setState({ refreshing: false, data: start })
        );
      } else {
        const nextIndex = response.length;
        let tempObj = {
          id: nextIndex,
          title: this.state.itemToAdd,
        };
        response.push(tempObj);
        storeData(this.state.typeOfList, response).then(
          this.setState({ refreshing: false, data: response })
        );
      }
    });
  };

  addToGroceryList = (itemObj) => {
    getData("@groceryList").then((response) => {
      if (response == null) {
        const start = [
          {
            id: "0",
            title: itemObj.title,
          },
        ];
        storeData("@groceryList", start);
      } else {
        const nextIndex = response.length;
        let tempObj = {
          id: nextIndex,
          title: itemObj.title,
        };
        response.push(tempObj);
        storeData("@groceryList", response);
      }
    });
    this.deleteFromInventory(itemObj);
  };

  addToInventory = (itemObj) => {
    getData("@inventoryList").then((response) => {
      if (response == null) {
        const start = [
          {
            id: "0",
            title: itemObj.title,
          },
        ];
        storeData("@inventoryList", start);
      } else {
        const nextIndex = response.length;
        let tempObj = {
          id: nextIndex,
          title: itemObj.title,
        };
        response.push(tempObj);
        storeData("@inventoryList", response);
      }
    });
    this.deleteFromGroceryList(itemObj);
  };

  deleteFromGroceryList = (itemObj) => {
    this.setState({ refreshing: true });
    getData("@groceryList").then((response) => {
      response.splice(itemObj.id, 1);
      storeData("@groceryList", response).then(
        this.setState({ refreshing: false, data: response })
      );
    });
  };

  deleteFromInventory = (itemObj) => {
    this.setState({ refreshing: true });
    getData("@inventoryList").then((response) => {
      response.splice(itemObj.id, 1);
      storeData("@inventoryList", response).then(
        this.setState({ refreshing: false, data: response })
      );
    });
  };

  deleteOnPress = (item) => {
    if (this.state.typeOfList == "@groceryList") {
      //ask if want to add to inventory
      Alert.alert("Delete", "Would you like to add this to your inventory?", [
        { text: "Yes", onPress: () => this.addToInventory(item) },
        {
          text: "No",
          onPress: () => {
            Alert.alert("Delete", "Are you sure you want to delete?", [
              { text: "Yes", onPress: () => this.deleteFromGroceryList(item) },
              { text: "No" },
            ]);
          },
        },
      ]);
    } else if (this.state.typeOfList == "@inventoryList") {
      //ask if want to add to grocery list
      Alert.alert(
        "Delete",
        "Would you like to add this to your grocery list?",
        [
          { text: "Yes", onPress: () => this.addToGroceryList(item) },
          {
            text: "No",
            onPress: () => {
              Alert.alert("Delete", "Are you sure you want to delete?", [
                { text: "Yes", onPress: () => this.deleteFromInventory(item) },
                { text: "No" },
              ]);
            },
          },
        ]
      );
    }
  };

  render() {
    return (
      <View style={{ alignItems: "center" }}>
        <View style={styles.addContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Enter an item"
            onChangeText={this.handleAdd}
          />
          <TouchableOpacity style={styles.addButton} onPress={this.addItem}>
            <Text style={styles.addEditText}>Add</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.itemsContainer}>
          <FlatList
            data={this.state.data}
            renderItem={(data) => (
              <View style={styles.item}>
                <Text style={styles.itemText}>{data.item.title}</Text>
                <View style={styles.editDeleteContainer}>
                  <TouchableOpacity style={styles.editButton}>
                    <Text style={styles.addEditText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => this.deleteOnPress(data.item)}
                  >
                    <Text style={styles.addEditText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            keyExtractor={(item) => item.id.toString()}
            refreshing={this.state.refreshing}
          />
        </View>
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
        <View style={styles.itemsContainer}>
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
  let ingredients = [
    {
      id: 1,
      ingredient: route.params.data.item.strIngredient1,
      measure: route.params.data.item.strMeasure1,
    },
    {
      id: 2,
      ingredient: route.params.data.item.strIngredient2,
      measure: route.params.data.item.strMeasure2,
    },
    {
      id: 3,
      ingredient: route.params.data.item.strIngredient3,
      measure: route.params.data.item.strMeasure3,
    },
    {
      id: 4,
      ingredient: route.params.data.item.strIngredient4,
      measure: route.params.data.item.strMeasure4,
    },
    {
      id: 5,
      ingredient: route.params.data.item.strIngredient5,
      measure: route.params.data.item.strMeasure5,
    },
    {
      id: 6,
      ingredient: route.params.data.item.strIngredient6,
      measure: route.params.data.item.strMeasure6,
    },
    {
      id: 7,
      ingredient: route.params.data.item.strIngredient7,
      measure: route.params.data.item.strMeasure7,
    },
    {
      id: 8,
      ingredient: route.params.data.item.strIngredient8,
      measure: route.params.data.item.strMeasure8,
    },
    {
      id: 9,
      ingredient: route.params.data.item.strIngredient9,
      measure: route.params.data.item.strMeasure9,
    },
    {
      id: 10,
      ingredient: route.params.data.item.strIngredient10,
      measure: route.params.data.item.strMeasure10,
    },
    {
      id: 11,
      ingredient: route.params.data.item.strIngredient11,
      measure: route.params.data.item.strMeasure11,
    },
    {
      id: 12,
      ingredient: route.params.data.item.strIngredient12,
      measure: route.params.data.item.strMeasure12,
    },
  ];
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.subHeaderText}>{route.params.data.item.strMeal}</Text>
      <View style={styles.recipeInfo}>
        <Text style={{ textAlign: "center", fontSize: 30 }}>Ingredients</Text>
        <FlatList
          data={ingredients}
          renderItem={({ item }) => (
            <View>
              <Text>
                {item.measure} {item.ingredient}
              </Text>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
      <TouchableOpacity style={styles.addRecipeButton}>
        <Text style={styles.addEditText}>Add to Grocery List</Text>
      </TouchableOpacity>
      <View style={styles.recipeInfo}>
        <Text style={{ textAlign: "center", fontSize: 30 }}>Instructions</Text>
        <ScrollView>
          <Text>{route.params.data.item.strInstructions}</Text>
        </ScrollView>
      </View>
      <NavButton text="Back To Recipes" nav={navigation} navigateTo="Recipes" />
    </SafeAreaView>
  );
}

function GroceryPage({ navigation, route }) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.subHeaderText}>Grocery List</Text>
      <List typeOfList="@groceryList" data={route.params.data} />
      <NavButton text="Back Home" nav={navigation} navigateTo="Home" />
    </SafeAreaView>
  );
}

function RecipePage({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.subHeaderText}>Recipes</Text>
      <RecipesList nav={navigation} navigateTo="SingleRecipe" />
      <NavButton text="Back Home" nav={navigation} navigateTo="Home" />
    </SafeAreaView>
  );
}

function InventoryPage({ navigation, route }) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.subHeaderText}>Inventory</Text>
      <List typeOfList="@inventoryList" data={route.params.data} />
      <NavButton text="Back Home" nav={navigation} navigateTo="Home" />
    </SafeAreaView>
  );
}

function SettingsPage({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.subHeaderText}>Settings</Text>
      <TouchableOpacity
        style={styles.addRecipeButton}
        onPress={() => clearAll()}
      >
        <Text style={styles.addEditText}>Clear All Items</Text>
      </TouchableOpacity>
      <NavButton text="Back Home" nav={navigation} navigateTo="Home" />
    </SafeAreaView>
  );
}

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
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
    margin: 10,
    fontFamily: "Noteworthy",
    textAlign: "center",
  },
  itemsContainer: {
    justifyContent: "center",
    borderRadius: 20,
    width: 300,
    height: 400,
    borderWidth: 3,
    padding: 10,
  },
  item: {
    flex: 1,
    flexDirection: "row",
  },
  itemText: {
    fontSize: 30,
  },
  textInput: {
    fontSize: 30,
    borderWidth: 3,
    padding: 5,
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
  addButton: {
    flex: 1,
    elevation: 8,
    backgroundColor: "#da96e7",
    borderRadius: 10,
    padding: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
  },
  editButton: {
    elevation: 8,
    backgroundColor: "#da96e7",
    borderRadius: 10,
    padding: 5,
    justifyContent: "center",
    margin: 2,
  },
  editDeleteContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    alignSelf: "flex-end",
  },
  addContainer: {
    flexDirection: "row",
    width: 300,
    height: 50,
    justifyContent: "center",
    margin: 5,
  },
  addEditText: {
    fontSize: 20,
    color: "#fff",
    textAlign: "center",
  },
  recipeInfo: {
    flex: 1,
    margin: 10,
    paddingHorizontal: 10,
    borderWidth: 3,
    borderRadius: 5,
    width: 300,
  },
  addRecipeButton: {
    elevation: 8,
    backgroundColor: "#da96e7",
    borderRadius: 10,
    padding: 5,
    justifyContent: "center",
    margin: 2,
    width: 300,
  },
});
