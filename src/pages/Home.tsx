import React, { useState, useEffect } from 'react';
import "./Home.css";
import Swal from 'sweetalert2';
import { Button, Input, Row, Col, Space, Modal, Form, Table, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faPlus } from "@fortawesome/free-solid-svg-icons";
import axiosInstance from "../services/http";
import axios from "axios";

interface DataType {
  key: string;
  nome: string;
  descricao: string;
  cep: string;
  endereco: string;
  numero: string;
  bairro: string;
  cidade: string;
  referencia: string;
  uf: string;
}

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);  // Novo estado para o modal de detalhes
  const [form] = Form.useForm();
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [searchResults, setSearchResults] = useState<DataType[]>([]); 
  const [ufSelecionada, setUfSelecionada] = useState<string>("");  
  const [cidades, setCidades] = useState<string[]>([]);  
  const [ufList, setUfList] = useState<string[]>([]);  
  const [selectedRecord, setSelectedRecord] = useState<DataType | null>(null);

  useEffect(() => {
    axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then(response => {
        const ufs = response.data.map((estado: any) => estado.sigla);
        setUfList(ufs);  
      })
      .catch(error => {
        console.error("Erro ao carregar UFs:", error);
      });
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleViewDetails = (record: DataType) => {
    setSelectedRecord(record); 
    setIsDetailsModalOpen(true);  // Abre o modal de detalhes
  };

  const handleSave = () => {
    form.validateFields()
      .then(values => {
        const formCadastro = {
          nome: values.nome,
          uf: ufSelecionada,  
          cidade: values.cidade,  
          descricao: values.descricao,
          referencia: values.referencia,  
        };
        setIsSaving(true);

        axiosInstance.post('/PontoTuristico', formCadastro, {
          headers: {
            'Content-type': 'application/json',
          },
        })
          .then(() => {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Configuração atualizada com sucesso!",
              showConfirmButton: false,
              timer: 1500
            });
            setIsModalOpen(false);
            form.resetFields();
          })
          .catch(error => {
            let errorMessage = "Erro ao realizar cadastro!";

            if (error.response) {
              errorMessage = error.response.data?.message || errorMessage;
            } else if (error.request) {
              errorMessage = "Sem resposta da API. Verifique sua conexão.";
            } else {
              errorMessage = "Erro ao configurar a requisição.";
            }

            Swal.fire({
              position: "center",
              icon: "error",
              title: errorMessage,
              showConfirmButton: false,
              timer: 1500
            });
          })
          .finally(() => {
            setIsSaving(false);
          });
      })
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsDetailsModalOpen(false);  // Fecha o modal de detalhes
    form.resetFields(); 
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);

    if (value.length > 3) {
      axiosInstance.get(`/PontoTuristico/buscar?termo=${value}`)
        .then(response => {
          const mappedResults = response.data.map((item: any, index: number) => ({
            key: String(index),
            nome: item.nome,
            descricao: item.descricao,
            cep: item.cep,
            endereco: item.endereco,
            numero: item.numero,
            bairro: item.bairro,
            cidade: item.cidade,  
            referencia: item.referencia,  
            uf: item.uf,  
          }));
          setSearchResults(mappedResults);
        })
        .catch(error => {
          console.error("Erro ao buscar dados:", error);
        });
    } else {
      setSearchResults([]);
    }
  };

  const handleListAll = () => {
    setSearchTerm(""); 
    axiosInstance.get('/PontoTuristico')
      .then(response => {
        const mappedResults = response.data.map((item: any, index: number) => ({
          key: String(index),
          nome: item.nome,
          descricao: item.descricao,
          cep: item.cep,
          endereco: item.endereco,
          numero: item.numero,
          bairro: item.bairro,
          cidade: item.cidade,  
          referencia: item.referencia,  
          uf: item.uf,  
        }));
        setSearchResults(mappedResults);
      })
      .catch(error => {
        console.error("Erro ao listar todos:", error);
      });
  };

  const handleUfChange = (uf: string) => {
    setUfSelecionada(uf);
    axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/distritos`)
      .then(response => {
        const sortedCidades = response.data.map((cidade: any) => cidade.nome);
        sortedCidades.sort((a: string, b: string) => a.localeCompare(b));
        setCidades(sortedCidades); 
      })
      .catch(error => {
        console.error("Erro ao buscar cidades:", error);
      });
  };

  const columns = [
    {
      title: 'Nome',
      dataIndex: 'nome',
      key: 'nome',
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: 'Descrição',
      dataIndex: 'descricao',
      key: 'descricao',
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: 'Referência',
      dataIndex: 'referencia',
      key: 'referencia',
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: 'UF',
      dataIndex: 'uf',
      key: 'uf',
    },
    {
      title: 'Cidade',
      dataIndex: 'cidade',
      key: 'cidade',
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: 'Ações',
      key: 'acoes',
      render: (_, record: any) => (
        <Space size="middle" align="center" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <a style={{ display: 'flex', alignItems: 'center' }} title="Detalhes" onClick={() => handleViewDetails(record)}>
            <FontAwesomeIcon icon={faInfoCircle} style={{ marginRight: '8px', fontSize: '20px' }} />
          </a>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: "20px" }}>
        <Col>
          <img src="/Logo_Ponto_SF.png" alt="Logo" style={{ height: "100px" }} />
        </Col>
        <Col>
          <Button
            className="custom-button"
            size="small"  
            style={{ width: "100%" }}  
            onClick={showModal}
          >
            Cadastrar Novo Ponto Turístico
            <FontAwesomeIcon icon={faPlus} style={{ marginLeft: "8px" }} />
          </Button>
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <Space direction="horizontal" style={{ width: "100%" }} align="center">
            <Input
              placeholder="Buscar ponto turístico por nome"
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={e => handleSearch(e.target.value)}
              size="small"
              style={{ width: "800px" }} 
            />
            <Button
              type="default"
              onClick={handleListAll}
              style={{ marginLeft: "10px", width: "150px" }}  
              size="small"  
            >
              Listar Todos
            </Button>
          </Space>
        </Col>
      </Row>

      <Row style={{ marginTop: "20px" }}>
        <Col span={24}>
          <Table columns={columns} dataSource={searchResults.length > 0 ? searchResults : []} /> 
        </Col>
      </Row>

      <Modal
        title="Detalhes do Ponto Turístico"
        open={isDetailsModalOpen}  // Usando o estado de modal de detalhes
        onCancel={handleCancel}
        footer={[ 
          <Button key="cancel" onClick={handleCancel}>
            Cancelar
          </Button>,
        ]}
      >
        {selectedRecord && (
          <div>
            <p><strong>Nome:</strong> {selectedRecord.nome}</p>
            <p><strong>Descrição:</strong> {selectedRecord.descricao}</p>
            <p><strong>Referência:</strong> {selectedRecord.referencia}</p>
            <p><strong>UF:</strong> {selectedRecord.uf}</p>
            <p><strong>Cidade:</strong> {selectedRecord.cidade}</p>
          </div>
        )}
      </Modal>

      <Modal
        title="Cadastrar Ponto Turístico"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[ 
          <Button key="cancel" onClick={handleCancel}>
            Cancelar
          </Button>,
          <Button
            key="save"
            type="primary"
            onClick={handleSave}
            loading={isSaving}
          >
            Salvar
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="nome" label="Nome" rules={[{ required: true, message: 'Por favor, insira o nome!' }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Localização">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item 
                  name="uf" 
                  label="UF" 
                  rules={[{ required: true, message: 'Por favor, selecione o estado!' }]} >
                  <Select placeholder="Selecione a UF" onChange={handleUfChange}>
                    {ufList.map((uf) => (
                      <Select.Option key={uf} value={uf}>
                        {uf}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item 
                  name="cidade" 
                  label="Cidade" 
                  rules={[{ required: true, message: 'Por favor, insira a cidade!' }]} >
                  <Select placeholder="Selecione a cidade">
                    {cidades.map((cidade, index) => (
                      <Select.Option key={index} value={cidade}>
                        {cidade}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>

          <Form.Item name="referencia" label="Referência">
            <Input />
          </Form.Item>

          <Form.Item name="descricao" label="Descrição" rules={[{ required: true, message: 'Por favor, insira a descrição!' }]}>
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Home;
