import React, { useState } from 'react';
import "./Home.css";
import Swal from 'sweetalert2'
import { Button, Input, Row, Col, Space, Modal, Form } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleSave = () => {
    form.validateFields()
      .then(values => {
        console.log(values);
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Ponto turístico salvo!",
          showConfirmButton: false,
          timer: 1500
        });
        setIsModalOpen(false);
        form.resetFields();
      })
      .catch(info => {
        console.log("Erro ao validar formulário:", info);
      });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: "20px" }}>
        <Col>
          <img src="/Logo_Ponto_SF.png" alt="Logo" style={{ height: "100px" }} />
        </Col>
        <Col>
          <Button
            className="custom-button"
            type="primary"
            onClick={showModal} 
          >
            Cadastrar Novo Ponto Turístico
            <FontAwesomeIcon icon={faPlus} style={{ marginLeft: "8px" }} />
          </Button>
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Input
              placeholder="Buscar ponto turístico por nome"
              prefix={<SearchOutlined />}
            />
          </Space>
        </Col>
      </Row>

      <Modal
        title="Cadastrar Ponto Turístico"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancelar
          </Button>,
          <Button key="save" type="primary" onClick={handleSave}>
            Salvar
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="nome" label="Nome" rules={[{ required: true, message: 'Por favor, insira o nome!' }]}> 
            <Input />
          </Form.Item>
          
          <Form.Item name="descricao" label="Descrição" rules={[{ required: true, message: 'Por favor, insira a descrição!' }]}>
            <Input.TextArea rows={3} />
          </Form.Item>
          
          <Form.Item name="cep" label="CEP" rules={[{ required: true, message: 'Por favor, insira o CEP!' }]}> 
            <Input />
          </Form.Item>

          <Form.Item name="endereco" label="Endereço" rules={[{ required: true, message: 'Por favor, insira o endereço!' }]}> 
            <Input />
          </Form.Item>
          
          <Form.Item name="numero" label="Número"> 
            <Input />
          </Form.Item>
          
          <Form.Item name="bairro" label="Bairro">
            <Input />
          </Form.Item>
          
          <Form.Item name="complemento" label="Complemento">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Home;
