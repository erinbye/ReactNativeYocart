import { StatusBar } from "expo-status-bar";
import React, { Component } from "react";
import { StyleSheet, Text, View, Button, TouchableOpacity } from "react-native";

class NavButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: props.text,
    };
  }

  render() {
    return (
      <TouchableOpacity activeOpacity={0.8} style={styles.navButtonContainer}>
        <Text style={styles.navButtonText}>{this.state.text}</Text>
      </TouchableOpacity>
    );
  }
}

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Yo-cart!</Text>
      <NavButton text="Grocery List" />
      <NavButton text="Recipes" />
      <NavButton text="Inventory" />
      <NavButton text="Settings" />
      <StatusBar style="auto" />
    </View>
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
    fontSize: 80,
    fontWeight: "bold",
    marginBottom: 30,
  },
  navButtonContainer: {
    elevation: 8,
    backgroundColor: "#da96e7",
    borderRadius: 30,
    paddingVertical: 20,
    height: 100,
    width: 300,
    alignItems: "center",
    margin: 10,
  },
  navButtonText: {
    fontSize: 40,
    fontFamily: "Times New Roman",
    color: "#fff",
  },
});
