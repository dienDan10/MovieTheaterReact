import { Button, ConfigProvider, Layout } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";
import ManagerSider from "./ManagerSider";
import { Content, Header } from "antd/es/layout/layout";
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";
import UserMenu from "../../components/UserMenu";
import { Outlet } from "react-router-dom";
import { ROLE_ADMIN, ROLE_MANAGER } from "../../utils/constant";
import AccessDenied from "../../pages/AccessDenied";

function ManagerLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useSelector((state) => state.user);
  return (
    <ConfigProvider
      theme={{
        components: {
          Layout: {
            siderBg: "oklch(21% 0.034 264.665)",
          },
        },
      }}
    >
      <Layout>
        <ManagerSider collapsed={collapsed} />

        <Layout>
          <Header className="bg-white! p-0! sticky top-0 shadow-sm flex justify-between items-center z-50">
            <Button
              type="text"
              icon={collapsed ? <AiOutlineMenuUnfold /> : <AiOutlineMenuFold />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
            <div className="px-3 md:px-8">
              <UserMenu />
            </div>
          </Header>

          <Content className="px-12 py-10">
            {user.role?.includes(ROLE_MANAGER) ? <Outlet /> : <AccessDenied />}
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}

export default ManagerLayout;
