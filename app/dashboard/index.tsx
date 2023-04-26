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
  /**
   * Add another comment
   */
  onPanResponderRelease: Parameters<
    PanResponder["create"]
  >[0]["onPanResponderRelease"];
}

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
      <Button title="+1" onPress={() => adjustMultiplier(1)} />
      <Button title="-1" onPress={() => adjustMultiplier(-1)} />
      <Animated.View
        style={{
          transform: [{ translateX: movement.x }, { translateY: movement.y }],
        }}
      >
        <Text style={{ color: "white" }}>x({movement.x.toFixed(2)})</Text>
        <Text style={{ color: "white" }}>y({movement.y.toFixed(2)})</Text>
        <Text style={{ color: "white" }}>multiplier({multiplier})</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default DisplayText;
