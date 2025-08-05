import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  VStack,
  HStack,
  Stack,
  Text,
  Spinner,
  useToast,
  Card,
  CardHeader,
  CardBody,
  SimpleGrid,
  Divider,
  Badge,
  IconButton,
  Flex,
  Avatar,
  Tag,
  TagLabel,
  Progress,
  Tabs,
  TabList,
  Tab,
  Input,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import {
  Download,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  BarChart2,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
} from "lucide-react";

const MotionBox = motion(Box);

const COLORS = ["#3182CE", "#4299E1", "#63B3ED", "#90CDF4", "#BEE3F8"];

export default function AnalyticsDashboard() {
  const [forms, setForms] = useState([]);
  const [data, setData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFormId, setSelectedFormId] = useState("");
  const [selectedFormTitle, setSelectedFormTitle] = useState("");
  const [showFormList, setShowFormList] = useState(false);
  const [selectedRespondent, setSelectedRespondent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [activeChartType, setActiveChartType] = useState("bar");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const toast = useToast();

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const res = await fetch("http://localhost/feedback-api/get_forms.php", {
          credentials: 'include' // This is crucial for session cookies
        });

        const json = await res.json();
        console.log("API Response:", json);

        if (json.status === "success" && Array.isArray(json.forms)) {
          setForms(json.forms);
        } else {
          console.error("API Error:", json.message);
          setForms([]);
          // If unauthorized, redirect to login
          if (json.message.includes("Unauthorized")) {
            window.location.href = "/login?redirect=/analytics";
          }
        }
      } catch (err) {
        console.error("Network Error:", err);
        setForms([]);
      }
    };
    fetchForms();
  }, []);

  // Add this useEffect hook
  useEffect(() => {
    const handleClickOutside = (event) => {
      const formSearch = document.getElementById("form-search-container");
      if (formSearch && !formSearch.contains(event.target)) {
        setShowFormList(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchFormData = async (formId) => {
    setLoading(true);
    setData(null);
    setSelectedRespondent(null);
    try {
      const res = await fetch(
        `http://localhost/feedback-api/get_submitted_responses.php?form_id=${formId}`
      );
      const json = await res.json();
      setData(json);
    } catch (err) {
      toast({
        title: "Error fetching data",
        status: "error",
        position: "top-right",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    if (!data) return;

    // Extract all unique question texts for headers
    const headers = [
      "Respondent ID",
      "Name",
      "Email",
      "Submission Date",
      "Completed",
      ...data.questions.map((q) => q.question_text),
    ];

    // Process each respondent's answers
    const rows = data.respondents.map((respondent) => {
      const answersMap = {};

      // Map answers by question_id for easy lookup
      respondent.answers.forEach((answer) => {
        try {
          // Try to parse JSON answers (for multiple choice questions)
          const parsed = JSON.parse(answer.answer);
          answersMap[answer.question_id] = Array.isArray(parsed)
            ? parsed.join("; ")
            : answer.answer;
        } catch (e) {
          answersMap[answer.question_id] = answer.answer;
        }
      });

      // Create row with respondent info and answers
      return [
        respondent.id,
        `"${respondent.name || "Anonymous"}"`, // Wrap in quotes to handle commas
        `"${respondent.email || ""}"`,
        new Date(respondent.submission_date).toISOString(),
        respondent.answers?.length === data.questions.length
          ? "Complete"
          : "Partial",
        ...data.questions.map((q) => {
          const answer = answersMap[q.id] || "No answer";
          // Escape quotes and wrap in quotes if contains commas
          const escaped = String(answer).replace(/"/g, '""');
          return escaped.includes(",") ? `"${escaped}"` : escaped;
        }),
      ];
    });

    // Combine headers and rows into CSV content
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `responses_${data.form.title.replace(
      /\s+/g,
      "_"
    )}_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const calculateResponseRate = () => {
    if (!data) return 0;
    const expected =
      data.form.expected_responses || data.respondents.length * 2;
    return Math.min(
      100,
      Math.round((data.respondents.length / expected) * 100)
    );
  };

  const generateChartData = (questionId) => {
    const counts = {};
    data.respondents.forEach((r) => {
      const answerObj = r.answers.find((a) => a.question_id === questionId);
      if (answerObj && answerObj.answer) {
        let answerData;
        try {
          answerData = JSON.parse(answerObj.answer);
        } catch (e) {
          answerData = answerObj.answer;
        }

        const answers = Array.isArray(answerData) ? answerData : [answerData];
        answers.forEach((answer) => {
          counts[answer] = (counts[answer] || 0) + 1;
        });
      }
    });
    return Object.entries(counts).map(([key, value]) => ({
      name: String(key),
      value,
    }));
  };

  // const calculateAverageRating = (questionId) => {
  //   const ratings = [];
  //   data.respondents.forEach((r) => {
  //     const answerObj = r.answers.find((a) => a.question_id === questionId);
  //     if (answerObj && !isNaN(answerObj.answer)) {
  //       ratings.push(Number(answerObj.answer));
  //     }
  //   });
  //   if (ratings.length === 0) return 0;
  //   return (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);
  // };

  const toggleQuestionExpand = (questionId) => {
    setExpandedQuestion(expandedQuestion === questionId ? null : questionId);
  };

  const renderChart = (questionId) => {
    const chartData = generateChartData(questionId);

    if (chartData.length === 0) {
      return <Text color="gray.500">No data available for this chart.</Text>;
    }

    switch (activeChartType) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip
                contentStyle={{ background: "white", borderRadius: "md" }}
              />
              <Legend />
              <Bar
                dataKey="value"
                fill="#3182ce"
                radius={[4, 4, 0, 0]}
                name="Responses"
              />
            </BarChart>
          </ResponsiveContainer>
        );
      case "pie":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                name="Responses"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: "white", borderRadius: "md" }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      default:
        return <Text>Select a chart type.</Text>;
    }
  };

  const renderResponseTrendChart = () => {
    if (!data || data.respondents.length < 2) return null;

    const dateCounts = {};
    data.respondents.forEach((r) => {
      const date = new Date(r.submission_date).toLocaleDateString();
      dateCounts[date] = (dateCounts[date] || 0) + 1;
    });

    const trendData = Object.entries(dateCounts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    return (
      <Card mb={8} boxShadow="md" bg="white">
        <CardHeader bg="blue.50" borderTopRadius="md">
          <Heading size="md">Select Form</Heading>
        </CardHeader>
        <CardBody>
          <Box position="relative" id="form-search-container">
            <Input
              placeholder="Search forms..."
              value={searchTerm}
              onChange={(e) => {
                const value = e.target.value;
                setSearchTerm(value);
                setShowFormList(true);
              }}
              onFocus={() => setShowFormList(true)}
              size="lg"
              bg="white"
              focusBorderColor="blue.500"
            />
            {showFormList && forms.length > 0 && (
              <Box
                position="absolute"
                width="100%"
                mt={1}
                bg="white"
                boxShadow="lg"
                borderRadius="md"
                zIndex="dropdown"
                maxH="300px"
                overflowY="auto"
                border="1px solid"
                borderColor="gray.200"
              >
                {forms
                  .filter(form =>
                    form.title.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .slice(0, 6)
                  .map(form => (
                    <Box
                      key={form.id}
                      p={3}
                      bg={selectedFormId === form.id ? "blue.50" : "white"}
                      _hover={{ bg: "blue.50" }}
                      cursor="pointer"
                      onClick={() => {
                        setSelectedFormId(form.id);
                        setSelectedFormTitle(form.title);
                        setSearchTerm(form.title);
                        setShowFormList(false);
                        fetchFormData(form.id);
                      }}
                    >
                      <Text fontWeight="medium">{form.title}</Text>
                      <Text fontSize="sm" color="gray.500">
                        Created: {new Date(form.created_at).toLocaleDateString()}
                      </Text>
                    </Box>
                  ))}
                {forms.filter(form =>
                  form.title.toLowerCase().includes(searchTerm.toLowerCase())
                ).length === 0 && (
                    <Box p={3}>
                      <Text color="gray.500">No forms found matching "{searchTerm}"</Text>
                    </Box>
                  )}
              </Box>
            )}
          </Box>
        </CardBody>
      </Card>
    );
  };

  const renderCompletionRateChart = () => {
    if (!data) return null;

    const completed = data.respondents.filter(
      (r) => r.answers?.length === data.questions.length
    ).length;
    const partial = data.respondents.length - completed;

    const completionData = [
      { name: "Complete", value: completed },
      { name: "Partial", value: partial },
    ];

    return (
      <Card mb={8} bg="white" boxShadow="md">
        <CardHeader bg="blue.50" borderTopRadius="md">
          <Heading size="md">Completion Rate</Heading>
        </CardHeader>
        <CardBody>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={completionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {completionData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === 0 ? "#38A169" : "#DD6B20"}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: "white", borderRadius: "md" }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>
    );
  };

  return (
    <MotionBox
      p={6}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      bg="gray.50"
      minH="100vh"
    >
      <Box maxW="1400px" mx="auto">
        <Flex justify="space-between" align="center" mb={8}>
          <Heading size="xl" color="blue.800">
            Analytics Dashboard
          </Heading>
          <Button
            leftIcon={<Download size={18} />}
            colorScheme="blue"
            variant="outline"
            onClick={exportCSV}
            isDisabled={!data}
          >
            Export Data
          </Button>
        </Flex>

        <Card mb={8} boxShadow="md" bg="white">
          <CardHeader bg="blue.50" borderTopRadius="md">
            <Heading size="md">Select Form</Heading>
          </CardHeader>
          <CardBody>
            <Select
              placeholder="Select a form to analyze..."
              value={selectedFormId}
              onChange={(e) => {
                const formId = e.target.value;
                setSelectedFormId(formId);
                if (formId) {
                  const selectedForm = forms.find(f => f.id === formId);
                  setSelectedFormTitle(selectedForm?.title || "");
                  fetchFormData(formId);
                }
              }}
              size="lg"
              bg="white"
              focusBorderColor="blue.500"
            >
              {forms.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.title} ({new Date(f.created_at).toLocaleDateString()})
                </option>
              ))}
            </Select>
          </CardBody>
        </Card>

        {loading && (
          <Flex justify="center" py={12}>
            <Spinner
              size="xl"
              color="blue.500"
              thickness="4px"
              emptyColor="gray.200"
            />
            <Text ml={4} fontSize="lg" color="blue.700">
              Loading form data...
            </Text>
          </Flex>
        )}

        {!loading && !data && (
          <Card textAlign="center" py={12} bg="white" boxShadow="sm">
            <Text fontSize="lg" color="gray.500">
              Select a form from the dropdown above to view analytics
            </Text>
          </Card>
        )}

        {!loading && data?.form && (
          <>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
              <Card
                bg="white"
                boxShadow="sm"
                borderTop="4px solid"
                borderColor="blue.500"
              >
                <CardHeader pb={0}>
                  <Heading size="sm" color="gray.600">
                    Total Responses
                  </Heading>
                </CardHeader>
                <CardBody>
                  <Flex align="flex-end">
                    <Heading size="2xl" color="blue.600">
                      {data.respondents.length}
                    </Heading>
                    <Text ml={2} mb={1} color="gray.500">
                      responses
                    </Text>
                  </Flex>
                </CardBody>
              </Card>
              <Card
                bg="white"
                boxShadow="sm"
                borderTop="4px solid"
                borderColor="green.500"
              >
                <CardHeader pb={0}>
                  <Heading size="sm" color="gray.600">
                    Response Rate
                  </Heading>
                </CardHeader>
                <CardBody>
                  <Stack spacing={4}>
                    <Flex align="flex-end">
                      <Heading size="2xl" color="green.600">
                        {calculateResponseRate()}%
                      </Heading>
                    </Flex>
                    <Progress
                      value={calculateResponseRate()}
                      colorScheme="green"
                      size="sm"
                      borderRadius="full"
                    />
                  </Stack>
                </CardBody>
              </Card>
              <Card
                bg="white"
                boxShadow="sm"
                borderTop="4px solid"
                borderColor="purple.500"
              >
                <CardHeader pb={0}>
                  <Heading size="sm" color="gray.600">
                    Questions
                  </Heading>
                </CardHeader>
                <CardBody>
                  <Flex align="flex-end">
                    <Heading size="2xl" color="purple.600">
                      {data.questions.length}
                    </Heading>
                    <Text ml={2} mb={1} color="gray.500">
                      questions
                    </Text>
                  </Flex>
                </CardBody>
              </Card>
            </SimpleGrid>

            <Card mb={8} bg="white" boxShadow="md">
              <CardHeader bg="blue.50" borderTopRadius="md">
                <Heading size="md">Form Details</Heading>
              </CardHeader>
              <CardBody>
                <Stack spacing={4}>
                  <Heading size="lg" color="blue.800">
                    {data.form.title}
                  </Heading>
                  <Text color="gray.600">{data.form.description}</Text>
                  <HStack spacing={3}>
                    <Tag colorScheme="blue" borderRadius="full" size="md">
                      <TagLabel>
                        Created:{" "}
                        {new Date(data.form.created_at).toLocaleDateString()}
                      </TagLabel>
                    </Tag>
                    <Tag colorScheme="green" borderRadius="full" size="md">
                      <TagLabel>Active</TagLabel>
                    </Tag>
                  </HStack>
                </Stack>
              </CardBody>
            </Card>

            {renderResponseTrendChart()}
            {renderCompletionRateChart()}

            <Card mb={8} bg="white" boxShadow="md">
              <CardHeader bg="blue.50" borderTopRadius="md">
                <Heading size="md">Question Analytics</Heading>
              </CardHeader>
              <CardBody>
                <VStack align="stretch" spacing={6}>
                  {data.questions.map((q, qIndex) => (
                    <Card key={q.id} variant="outline" overflow="hidden">
                      <CardHeader
                        py={3}
                        cursor="pointer"
                        onClick={() => toggleQuestionExpand(q.id)}
                        _hover={{ bg: "gray.50" }}
                        bg={expandedQuestion === q.id ? "gray.50" : "white"}
                      >
                        <Flex justify="space-between" align="center">
                          <HStack>
                            <Box
                              bg="blue.100"
                              p={2}
                              borderRadius="md"
                              minW="36px"
                              textAlign="center"
                            >
                              <Text fontWeight="bold" color="blue.800">
                                {qIndex + 1}
                              </Text>
                            </Box>
                            <Text fontWeight="semibold">{q.question_text}</Text>
                          </HStack>
                          <IconButton
                            icon={
                              expandedQuestion === q.id ? (
                                <ChevronUp />
                              ) : (
                                <ChevronDown />
                              )
                            }
                            variant="ghost"
                            aria-label="Toggle question details"
                          />
                        </Flex>
                        <Badge
                          colorScheme={
                            q.question_type === "multiple_choice"
                              ? "purple"
                              : q.question_type === "rating"
                                ? "orange"
                                : "green"
                          }
                          mt={2}
                        >
                          {q.question_type.replace(/_/g, " ")}
                        </Badge>
                      </CardHeader>
                      {expandedQuestion === q.id && (
                        <>
                          <Divider />
                          <CardBody>
                            {q.question_type !== "text" && (
                              <Tabs
                                variant="enclosed"
                                mb={4}
                                onChange={(index) =>
                                  setActiveChartType(
                                    ["bar", "pie"][index] || "bar"
                                  )
                                }
                              >
                                <TabList>
                                  <Tab>
                                    <BarChart2 size={16} />
                                    <Text ml={2}>Bar</Text>
                                  </Tab>
                                  <Tab>
                                    <PieChartIcon size={16} />
                                    <Text ml={2}>Pie</Text>
                                  </Tab>
                                </TabList>
                              </Tabs>
                            )}
                            {renderChart(q.id)}
                          </CardBody>
                        </>
                      )}
                    </Card>
                  ))}
                </VStack>
              </CardBody>
            </Card>

            <Card mb={8} bg="white" boxShadow="md">
              <CardHeader bg="blue.50" borderTopRadius="md">
                <Flex justify="space-between" align="center">
                  <Heading size="md">
                    Respondents ({data.respondents.length})
                  </Heading>
                </Flex>
              </CardHeader>
              <CardBody p={0}>
                <Table variant="simple">
                  <Thead bg="blue.50">
                    <Tr>
                      <Th>#</Th>
                      <Th>Respondent</Th>
                      <Th>Email</Th>
                      <Th>Date</Th>
                      <Th>Completed</Th>
                      <Th textAlign="right">Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {data.respondents
                      .slice(
                        (currentPage - 1) * pageSize,
                        currentPage * pageSize
                      )
                      .map((r, index) => (
                        <Tr
                          key={r.id}
                          _hover={{ bg: "gray.50" }}
                          cursor="pointer"
                          onClick={() => setSelectedRespondent(r)}
                        >
                          <Td fontWeight="medium">
                            {(currentPage - 1) * pageSize + index + 1}
                          </Td>
                          <Td>
                            <Flex align="center">
                              <Avatar
                                name={r.name}
                                size="sm"
                                mr={3}
                                bg="blue.500"
                                color="white"
                              />
                              <Text fontWeight="medium">
                                {r.name || "Anonymous"}
                              </Text>
                            </Flex>
                          </Td>
                          <Td>{r.email || "-"}</Td>
                          <Td>
                            {new Date(r.submission_date).toLocaleDateString()}
                          </Td>
                          <Td>
                            <Badge
                              colorScheme={
                                r.answers?.length === data.questions.length
                                  ? "green"
                                  : "orange"
                              }
                              borderRadius="full"
                              px={2}
                            >
                              {r.answers?.length === data.questions.length
                                ? "Complete"
                                : "Partial"}
                            </Badge>
                          </Td>
                          <Td textAlign="right">
                            <Button
                              size="sm"
                              colorScheme="blue"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedRespondent(r);
                              }}
                            >
                              View Details
                            </Button>
                          </Td>
                        </Tr>
                      ))}
                  </Tbody>
                </Table>
                <Flex justifyContent="center" p={4}>
                  <Stack direction="row" spacing={4} align="center">
                    <Button
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      size="sm"
                    >
                      First
                    </Button>
                    <Button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      size="sm"
                    >
                      Previous
                    </Button>
                    <Text>
                      Page {currentPage} of{" "}
                      {Math.ceil(data.respondents.length / pageSize)}
                    </Text>
                    <Button
                      onClick={() =>
                        setCurrentPage((p) =>
                          Math.min(
                            p + 1,
                            Math.ceil(data.respondents.length / pageSize)
                          )
                        )
                      }
                      disabled={
                        currentPage ===
                        Math.ceil(data.respondents.length / pageSize)
                      }
                      size="sm"
                    >
                      Next
                    </Button>
                    <Button
                      onClick={() =>
                        setCurrentPage(
                          Math.ceil(data.respondents.length / pageSize)
                        )
                      }
                      disabled={
                        currentPage ===
                        Math.ceil(data.respondents.length / pageSize)
                      }
                      size="sm"
                    >
                      Last
                    </Button>
                  </Stack>
                </Flex>
              </CardBody>
            </Card>

            {selectedRespondent && (
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card mb={8} bg="white" boxShadow="md">
                  <CardHeader bg="blue.50" borderTopRadius="md">
                    <Flex align="center">
                      <IconButton
                        icon={<ArrowLeft />}
                        variant="ghost"
                        mr={2}
                        onClick={() => setSelectedRespondent(null)}
                        aria-label="Back to respondents"
                      />
                      <Box>
                        <Heading size="md">Response Details</Heading>
                        {/* --- START OF FIX 2 --- */}
                        <Text color="gray.500" fontSize="sm">
                          {selectedRespondent.name || "Anonymous"} -{" "}
                          {new Date(
                            selectedRespondent.submission_date
                          ).toLocaleString()}
                        </Text>
                        {/* --- END OF FIX 2 --- */}
                      </Box>
                    </Flex>
                  </CardHeader>
                  <CardBody>
                    {selectedRespondent.answers?.length === 0 ? (
                      <Text color="gray.500" textAlign="center" py={8}>
                        No answers submitted by this respondent.
                      </Text>
                    ) : (
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                        {data.questions.map((q, index) => {
                          const answerObj = selectedRespondent.answers.find(
                            (a) => a.question_id === q.id
                          );

                          // --- START OF FIX 3 ---
                          let answerText = "No answer provided";
                          if (
                            answerObj &&
                            (answerObj.answer || answerObj.answer === "0")
                          ) {
                            try {
                              const parsed = JSON.parse(answerObj.answer);
                              answerText = Array.isArray(parsed)
                                ? parsed.join(", ")
                                : answerObj.answer;
                            } catch (e) {
                              answerText = answerObj.answer;
                            }
                          }
                          // --- END OF FIX 3 ---

                          return (
                            <Card key={q.id} variant="outline">
                              <CardHeader bg="blue.50" py={2} px={4}>
                                <HStack>
                                  <Text fontWeight="bold" color="blue.800">
                                    Q{index + 1}:
                                  </Text>
                                  <Text fontWeight="semibold">
                                    {q?.question_text}
                                  </Text>
                                </HStack>
                              </CardHeader>
                              <CardBody p={4}>
                                <Box
                                  borderLeft="4px solid"
                                  borderColor="blue.300"
                                  pl={3}
                                  py={1}
                                >
                                  <Text>{answerText}</Text>
                                </Box>
                              </CardBody>
                            </Card>
                          );
                        })}
                      </SimpleGrid>
                    )}
                  </CardBody>
                </Card>
              </MotionBox>
            )}
          </>
        )}
      </Box>
      {/* Scroll to Top Button */}
      <Box position="fixed" bottom="6" right="6" zIndex="100">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <IconButton
            aria-label="Scroll to top"
            icon={<ChevronUp />}
            colorScheme="blue"
            size="lg"
            borderRadius="full"
            boxShadow="lg"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          />
        </motion.div>
      </Box>
    </MotionBox>
  );
}
