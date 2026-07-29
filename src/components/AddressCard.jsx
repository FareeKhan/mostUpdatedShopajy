import React, { useState, useEffect } from 'react'
import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import CustomText from '../components/CustomText'
import { colors } from '../constants/color'
import { useDispatch, useSelector } from 'react-redux'
import CustomButton from './CustomButton'
import { useNavigation } from '@react-navigation/native'
import { setDefaultAddressRemote } from '../redux/reducers/StoreAddress'

const activeColor = '#0DF6B7'
const darkTextColor = '#051A31'

const AddressSection = ({
    selectedAddressId,
    onSelectAddress
}) => {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const addresses = useSelector(s => s?.address?.address) || []

    const getDefaultId = (list) => {
        const defaultItem = list.find(item => item?.is_default)
        return defaultItem ? defaultItem.id : list[0]?.id
    }

    const [internalSelectedId, setInternalSelectedId] = useState(() => getDefaultId(addresses))

    useEffect(() => {
        if (addresses.length > 0) {
            const currentDefaultId = getDefaultId(addresses)
            setInternalSelectedId(currentDefaultId)
        }
    }, [addresses])

    const activeId = selectedAddressId !== undefined ? selectedAddressId : internalSelectedId

    const handlePress = async (id) => {
        setInternalSelectedId(id)
        if (onSelectAddress) {
            onSelectAddress(id)
        }
        // Dispatch set default address remote action
        try {
            await dispatch(setDefaultAddressRemote(id))
        } catch (error) {
            console.error('Failed to set default address:', error)
        }
    }

    const SingleCardItem = ({ item, isSelected, onSelect }) => {
        const getIcon = (type) => {
            switch (type?.toLowerCase()) {
                case 'home':
                    return 'home-outline'
                case 'work':
                    return 'business-outline'
                default:
                    return 'location-outline'
            }
        }

        return (
            <TouchableOpacity
                onPress={onSelect}
                activeOpacity={0.8}
                style={[
                    styles.cardContainer,
                    isSelected && styles.activeCardContainer,
                ]}
            >
                <View style={styles.cardRow}>
                    <View style={styles.circleWrapper}>
                        <View style={[styles.outerCircle, isSelected && { borderColor: activeColor }]}>
                            {isSelected && <View style={styles.innerCircle} />}
                        </View>
                    </View>

                    <View style={styles.textContainer}>
                        <View style={styles.titleRow}>
                            <CustomText style={styles.addressType} bold>
                                {item?.type}
                            </CustomText>
                            
                            {/* Display "Default" badge on whichever card is currently default/selected */}
                            {isSelected && (
                                <View style={styles.defaultBadge}>
                                    <CustomText style={styles.defaultBadgeText} bold>Default</CustomText>
                                </View>
                            )}
                        </View>

                        <CustomText style={styles.addressDetailText} semiBold numberOfLines={2} translate={false}>
                            {item?.street},
                        </CustomText>

                        <CustomText style={styles.addressDetailText} semiBold numberOfLines={2} translate={false}>
                            {item?.building ? `Bldg ${item.building}, ` : ''}{item?.floor ? `Floor ${item.floor}` : ''}
                        </CustomText>
                        
                        {item?.phone && (
                            <CustomText style={styles.addressDetailText} semiBold numberOfLines={2} translate={false}>
                                {item?.phone}
                            </CustomText>
                        )}
                    </View>

                    <View style={styles.iconCircle}>
                        <Ionicons name={getIcon(item?.type)} size={22} color={darkTextColor} />
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <View>
            <FlatList
                data={addresses}
                keyExtractor={(item) => item?.id?.toString()}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <SingleCardItem
                        item={item}
                        isSelected={item?.id === activeId}
                        onSelect={() => handlePress(item?.id)}
                    />
                )}
            />

            <CustomButton
                title={'addAddress'}
                style={{ backgroundColor: colors.secondary, height: 50, marginBottom: 20 }}
                leftIcon={<Ionicons name={'location-outline'} color={colors.black} size={20} />}
                textStyle={{ color: colors.black, fontSize: 15, marginLeft: -7 }}
                onPress={() => navigation.navigate('AddNewAddressScreen')}
            />
        </View>
    )
}

export default AddressSection

const styles = StyleSheet.create({
    content: {
        flex: 1,
        paddingHorizontal: 15,
    },
    cardContainer: {
        width: '100%',
        backgroundColor: colors?.white || '#FFFFFF',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderWidth: 1.5,
        borderColor: '#ECF1F6',
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3.84,
        elevation: 2,
    },
    activeCardContainer: {
        borderColor: activeColor,
        backgroundColor: '#E8FEF8',
    },
    cardRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    circleWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    outerCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#8CA0B2',
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerCircle: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: activeColor,
    },
    textContainer: {
        flex: 1,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    addressType: {
        fontSize: 16,
        color: darkTextColor,
        textTransform: 'capitalize',
    },
    defaultBadge: {
        backgroundColor: darkTextColor,
        paddingHorizontal: 5,
        paddingVertical: 2,
        borderRadius: 7,
        marginLeft: "auto"
    },
    defaultBadgeText: {
        color: activeColor,
    },
    addressDetailText: {
        fontSize: 13,
        color: colors.gray34,
    },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#F3F7FA',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 12,
    },
})