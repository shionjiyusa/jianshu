import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Menu from '../../components/Menu';
import Footer from '../../components/Footer';
import Score from './components/Score';
import Tag from './components/Tag';
import Comment from './components/Comment';
import { getPicture, getCollectionState, collect, unCollect } from './service';
import './style.scss';

function Picture() {
  const { pid, limit = false } = useParams(); // 获取路由 params
  const [pic, setPic] = useState({});
  const [collectionState, setCollectionState] = useState(false);

  useEffect(() => {
    getPicture(pid, limit).then((res) => {
      setPic(res.data);
    });
  }, []);

  useEffect(() => {
    getCollectionState(pid)
      .then(() => {
        setCollectionState(true);
        return null;
      })
      .catch(() => null);
  }, []);

  // 根据登录状态改变内容
  const login = !localStorage.getItem('token');

  // 收藏图片
  const collectingPic = () => {
    if (!login) {
      collect(pid);
      setCollectionState(true);
    }
  };
  // 取消收藏
  const unCollectingPic = () => {
    if (!login) {
      unCollect(pid);
      setCollectionState(false);
    }
  };

  // 判断对象是否为空，解决空对象属性引用报错
  if (JSON.stringify(pic) === '{}') {
    return null;
  }

  const { picture_url: url, created_at: createdAt, scores } = pic;
  // 处理时间表示方法
  const time = createdAt.split(/T|\./);

  return (
    <>
      <Menu />
      <div className="picture-page-wrapper">
        <div className="picture">
          <img src={url} alt={pid} />
        </div>
        <div className="picture-foot">
          <div className="picture-foot-column">
            <span>
              投稿时间：
              {/* {Moment(Number(`${created_at}000`)).format('YYYY-MM-DD')} */}
              {`${time[0]} ${time[1]}`}
              <br />
              投稿人：
            </span>

            {collectionState ? (
              <span
                className="iconfont"
                title="取消收藏"
                style={{ color: 'red' }}
                onClick={unCollectingPic}
                role="button"
                onKeyPress={() => {}}
                tabIndex={0}
              >
                &#xe613;
              </span>
            ) : (
              <span
                className="iconfont"
                title="收藏图片"
                onClick={collectingPic}
                role="button"
                onKeyPress={() => {}}
                tabIndex={0}
              >
                &#xe613;
              </span>
            )}
          </div>

          <div className="picture-foot-column">
            <Score scores={scores} pid={pid} />
          </div>
          <div className="picture-foot-column">
            <Tag pid={pid} />
          </div>
          <div className="picture-foot-column">
            <Comment pid={pid} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Picture;
