import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";

/**
 * TypeSelect
 * A text input that lets a user either type a free value or pick from preset options.
 * Presets are filtered live as the user types (case-insensitive substring match).
 * Selecting a preset calls onChange with (value, true). Typing custom text uses (value, false).
 *
 * Example:
 * <TypeSelect
 *    value={foodType}
 *    presets={["Pizza", "Pasta", "Sushi", "Burger"]}
 *    placeholder="Type or pick a cuisine"
 *    onChange={(val, isPreset) => { setFoodType(val); }}
 * />
 */

export type SimplePreset = { label: string; value: string };

export interface TypeSelectProps {
	value: string;
	onChange: (value: string, isPreset: boolean) => void;
	presets: SimplePreset[];
	placeholder?: string;
	autoFocus?: boolean;
	maxDropdownHeight?: number;
}

export const TypeSelect: React.FC<TypeSelectProps> = ({
	value,
	onChange,
	presets,
	placeholder = "",
	autoFocus,
	maxDropdownHeight = 220,
}) => {
	const [open, setOpen] = useState(false);
	const [inner, setInner] = useState(value ?? "");
	const inputRef = useRef<TextInput | null>(null);

	// Sync external value
	useEffect(() => {
		setInner(value ?? "");
	}, [value]);

	const lower = inner.toLowerCase();

	const matches = useMemo(() => {
		return presets
			.filter((p) => p.label.toLowerCase().includes(lower))
			.slice(0, 25);
	}, [lower, presets]);

	const isExactPreset = useMemo(
		() => presets.some((p) => p.value.toLowerCase() === lower && lower.length > 0),
		[presets, lower]
	);

	const handleChangeText = useCallback(
		(txt: string) => {
			setInner(txt);
			onChange(txt, false);
			setOpen(true);
		},
		[onChange]
	);

	const handleSelect = useCallback(
		(preset: { label: string; value: string }) => {
			setInner(preset.value);
			onChange(preset.value, true);
			setOpen(false);
		},
		[onChange]
	);

	const handleBlur = useCallback(() => {
		setTimeout(() => setOpen(false), 120); // TODO: why delay?
	}, []);

	const containerBg = "#1f2937";
	const borderColor = "#374151";

	return (
		<View
			style={{
				width: "100%",
				position: "relative",
				// Raise stacking context while open so list overlays following form fields
				zIndex: open ? 1000 : 0,
			}}
		>
			<Pressable
				onPress={() => {
					inputRef.current?.focus();
					setOpen(true);
				}}
				style={({ pressed }) => [
					{
						flexDirection: "row",
						alignItems: "center",
						gap: 8,
						backgroundColor: containerBg,
						borderWidth: 1,
						borderColor,
						borderRadius: 10,
						paddingHorizontal: 12,
						paddingVertical: 8,
						opacity: pressed ? 0.85 : 1,
					},
				]}
			>
                <Ionicons name="search" size={16} color={"#9ca3af"} />
				<TextInput
					ref={inputRef}
					value={inner}
					onChangeText={handleChangeText}
					placeholder={placeholder}
					placeholderTextColor="#6b7280"
					onFocus={() => setOpen(true)}
					onBlur={handleBlur}
					autoFocus={autoFocus}
					style={[
						{
							flex: 1,
							color: "#fff",
							padding: 0,
							fontSize: 14,
						},
					]}
				/>
				<Ionicons
					name={open ? "chevron-up" : "chevron-down"}
					size={16}
					color={"#9ca3af"}
				/>
			</Pressable>

			{open && (
				<View
					style={{
						position: "absolute",
						top: 44,
						left: 0,
						right: 0,
						backgroundColor: "#111827",
						borderWidth: 1,
						borderColor: "#374151",
						borderRadius: 10,
						paddingVertical: 4,
						maxHeight: maxDropdownHeight,
						overflow: "hidden",
						zIndex: 2000, // ensure above sibling containers
						elevation: 20,
						shadowColor: '#000',
						shadowOpacity: 0.25,
						shadowRadius: 8,
						shadowOffset: { width: 0, height: 4 },
					}}
				>
					<FlatList
						keyboardShouldPersistTaps="handled"
						data={matches}
						keyExtractor={(item) => item.value}
						renderItem={({ item }) => (
							<Pressable
								onPress={() => handleSelect(item)}
								style={({ pressed }) => ({
									paddingVertical: 10,
									paddingHorizontal: 12,
									backgroundColor: pressed ? "#1f2937" : "transparent",
								})}
							>
								<Text style={{ color: "#fff", fontSize: 14 }}>{item.label}</Text>
							</Pressable>
						)}
						ListEmptyComponent={() => (
							<View style={{ padding: 12 }}>
								<Text style={{ color: "#6b7280", fontSize: 12 }}>No matches</Text>
							</View>
						)}
						style={{ maxHeight: maxDropdownHeight }}
					/>
					{!isExactPreset && inner.trim().length > 0 && (
						<Pressable
							onPress={() => {
								onChange(inner.trim(), false);
								setOpen(false);
							}}
							style={({ pressed }) => ({
								borderTopWidth: matches.length ? 1 : 0,
								borderColor: "#374151",
								paddingVertical: 10,
								paddingHorizontal: 12,
								backgroundColor: pressed ? "#1f2937" : "#0b0f16",
							})}
						>
							<Text style={{ color: "#9ca3af", fontSize: 12 }}>
								Use <Text style={{ color: "#fff" }}>{inner.trim()}</Text> as custom value
							</Text>
						</Pressable>
					)}
				</View>
			)}
		</View>
	);
};
