import React, { useEffect, useState } from 'react';
import { View, FlatList, TextInput, TouchableOpacity, ActivityIndicator, Modal, Image, KeyboardAvoidingView, Platform, StyleSheet, I18nManager } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import CustomText from '../components/CustomText';
import { colors } from '../constants/color';
import { fetchReelComments, postReelComment } from '../redux/reducers/Reels';
import { useTranslation } from 'react-i18next';
import { fonts } from '../constants/fonts';

const ReelCommentsModal = ({ visible, onClose, reelId }) => {
    const dispatch = useDispatch();
const {t} = useTranslation()

    const comments = useSelector(s => s.reels.comments[reelId]) || [];
    const loading = useSelector(s => s.reels.commentsLoading);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        if (visible && reelId) {
            dispatch(fetchReelComments(reelId));
        }
    }, [visible, reelId, dispatch]);

    const handleSend = () => {
        if (!newComment.trim()) return;
        dispatch(postReelComment({ reelId, body: newComment.trim() }));
        setNewComment('');
    };

    const renderCommentItem = ({ item }) => (
        <View style={styles.commentRow}>
            <Image source={{ uri: item?.user?.avatar }} style={styles.avatar} />
            <View style={styles.commentContent}>
                <CustomText translate={false} bold style={styles.userName}>{item?.user?.name}</CustomText>
                <CustomText translate={false} style={styles.commentBody}>{item?.body}</CustomText>
            </View>
        </View>
    );

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <TouchableOpacity style={styles.backdropTouch} onPress={onClose} />
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalContainer}>
                    <View style={styles.header}>
                        <CustomText bold style={styles.headerTitle}>comments</CustomText>
                        <TouchableOpacity onPress={onClose}>
                            <Feather name="x" size={24} color={colors.black} />
                        </TouchableOpacity>
                    </View>

                    {loading ? (
                        <ActivityIndicator style={{ flex: 1 }} color={colors.black} />
                    ) : (
                        <FlatList
                            data={comments}
                            keyExtractor={(item) => String(item.id)}
                            renderItem={renderCommentItem}
                            contentContainerStyle={styles.listContainer}
                            ListEmptyComponent={<CustomText style={styles.emptyText}>emptyState</CustomText>}
                        />
                    )}

                    <View style={styles.inputContainer}>
                        <TextInput
                            value={newComment}
                            onChangeText={setNewComment}
                            placeholder={t("writeComment")}
                            placeholderTextColor={colors.gray3}
                            style={styles.input}
                        />
                        <TouchableOpacity onPress={handleSend} disabled={!newComment} style={[styles.sendBtn,!newComment && {backgroundColor:colors.gray}]}>
                            <Feather name="send" size={20} color={colors.white} style={{ transform: [{ rotate: I18nManager.isRTL ?'-90deg' : '0deg',  }] }}/>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
};

export default ReelCommentsModal;

const styles = StyleSheet.create({
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    backdropTouch: { flex: 1 },
    modalContainer: { height: '65%', backgroundColor: colors.white, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, borderBottomWidth: 1, borderColor: colors.gray4 },
    headerTitle: { fontSize: 16 },
    listContainer: { padding: 15 },
    commentRow: { flexDirection: 'row', marginBottom: 15, alignItems: 'flex-start' },
    avatar: { width: 35, height: 35, borderRadius: 17.5, backgroundColor: colors.gray4 },
    commentContent: { marginLeft: 10, flex: 1, backgroundColor: colors.gray25, padding: 10, borderRadius: 10 },
    userName: { fontSize: 13, color: colors.black },
    commentBody: { fontSize: 14, color: colors.black3, marginTop: 2 },
    emptyText: { textAlign: 'center', marginTop: 40, color: colors.gray3 },
    inputContainer: { marginBottom:20,flexDirection: 'row', padding: 12, borderTopWidth: 1, borderColor: colors.gray4, alignItems: 'center' },
    input: { flex: 1, height: 50, borderWidth: 1, borderColor: colors.gray5, borderRadius: 20, paddingHorizontal: 15, color: colors.black ,fontFamily:fonts.regular},
    sendBtn: { marginLeft: 10, backgroundColor: colors.secondary, width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' }
});