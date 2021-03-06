import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { message, Button, Menu as AMenu } from 'antd';
import checkLoginStatus from 'utils/checkLoginStatus';
import Menu from '../../components/Menu';
import Footer from '../../components/Footer';
import AvatarSelector from './components/AvatarSelector';
import ProfileEditor from './components/ProfileEditor';
import Section from './components/Section';
import getUserInfo from './service';
import './style.scss';

function User() {
  const { uid } = useParams();
  const [user, setUser] = useState({}); // 用户资料
  const [menu, setMenu] = useState(''); // 菜单状态
  const [avatarSelector, setAvatarSelector] = useState(false); // 头像修改 Modal
  const [profileEditor, setProfileEditor] = useState(false); // 资料修改 Modal

  useEffect(() => {
    // 获取用户资料
    getUserInfo(uid)
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        if (err.response.status === 404) {
          message.error('用户不存在');
        }
      });
  }, [uid]);

  // 对比是否为用户本人主页
  const loginUser = checkLoginStatus();
  let isOwner = false;
  if (loginUser.uid === uid * 1) {
    isOwner = true;
  }

  const { email, avatar_url: avatar, name, headline, gender, age } = user;

  return (
    <>
      <Menu />
      <div className="profile">
        <span className="user-info">
          <img src={avatar || 'http://img.sena.moe/favicon.ico'} alt={name} />
          <div>
            <h2>{name || email}</h2>
            签名：
            {headline}
            <br />
            性别：
            {gender}
            <br />
            年龄：
            {age || '未知'}
            <br />
            {isOwner && (
              <div>
                <Button onClick={() => setAvatarSelector(true)}>修改头像</Button>
                <Button onClick={() => setProfileEditor(true)}>修改资料</Button>
              </div>
            )}
            {loginUser && !isOwner && (
              <div>
                <Button type="primary">关注</Button>
              </div>
            )}
            <AvatarSelector visible={avatarSelector} setVisible={setAvatarSelector} />
            <ProfileEditor visible={profileEditor} setVisible={setProfileEditor} />
          </div>
        </span>
        <section>
          <AMenu
            defaultSelectedKeys={['collection']}
            mode="horizontal"
            onClick={(item) => {
              setMenu(item.key);
            }}
          >
            <AMenu.Item key="collection">用户收藏</AMenu.Item>
            <AMenu.Item key="upload">用户上传</AMenu.Item>
            <AMenu.Item key="follow">关注</AMenu.Item>
            <AMenu.Item key="follower">粉丝</AMenu.Item>
          </AMenu>
          <Section menu={menu} uid={uid} />
        </section>
      </div>
      <Footer />
    </>
  );
}

export default User;
