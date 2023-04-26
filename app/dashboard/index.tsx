import { useRef, useState, useEffect } from "react";
import {
  Text,
  Animated,
  Button,
  PanResponder,
  StyleSheet,
  View,
  GestureResponderHandlers,
} from "react-native";

interface UsePanSwaggalerOptions {
  onPanResponderMove: Parameters<
    PanResponder["create"]
  >[0]["onPanResponderMove"];
  onPanResponderRelease: Parameters<
    PanResponder["create"]
  >[0]["onPanResponderRelease"];
}

/**
 * A hook that creates a new PanResponder instance every time the `dependencyArray` changes, and returns the `panHandlers` object to be used on a View component.
 * @param options - An object containing the `onPanResponderMove` and `onPanResponderRelease` callback functions.
 * @param dependencyArray - An array of dependencies that will trigger the effect when changed, and re-instantiate the PanResponder.
 * @returns An object containing the `panHandlers` object to be used on a View component.
 */
const usePanSwaggler = (
  { onPanResponderMove, onPanResponderRelease }: UsePanSwaggalerOptions,
  dependencyArray: unknown[]
) => {
  const [panHandlers, setPanHandlers] = useState<GestureResponderHandlers>();

  useEffect(() => {
    const responder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove,
      onPanResponderRelease,
    });

    setPanHandlers(responder.panHandlers);
  }, dependencyArray);

  return { panHandlers };
};

const DisplayText = () => {
  const [multiplier, setMultiplier] = useState<number>(1);
  const position = useRef(new Animated.ValueXY()).current;
  const [movement, setMovement] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const { panHandlers } = usePanSwaggler(
    {
      onPanResponderMove: (_, state) => {
        position.setValue({
          x: state.dx * multiplier,
          y: state.dy * multiplier,
        });
      },
      onPanResponderRelease: () => position.extractOffset(),
    },
    [multiplier]
  );

  useEffect(() => {
    const listener = position.addListener(setMovement);
    return () => position.removeListener(listener);
  }, []);

  const adjustMultiplier = (difference: number) => {
    setMultiplier((previous) => difference + previous);
  };

  return (
    <View {...panHandlers} style={[styles.view]}>
      <Button title="+1" onPress={() => adjustMultiplier(1)} color="#e7e5e4" />
      <Button title="-1" onPress={() => adjustMultiplier(-1)} color="#e7e5e4" />
      <Animated.View
        style={[
          {
            transform: [{ translateX: movement.x }, { translateY: movement.y }],
          },
          styles.details,
        ]}
      >
        <Text style={{ color: "#e7e5e4" }}>x({movement.x.toFixed(2)})</Text>
        <Text style={{ color: "#e7e5e4" }}>y({movement.y.toFixed(2)})</Text>
        <Text style={{ color: "#e7e5e4" }}>multiplier({multiplier})</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: "#1c1917",
    justifyContent: "center",
    alignItems: "center",
  },
  details: {
    padding: 16,
    backgroundColor: "#292524",
    borderRadius: 4,
    borderColor: "#44403c",
    borderWidth: 1,
  },
});

export default DisplayText;
