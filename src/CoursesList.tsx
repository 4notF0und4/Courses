import React, { useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  CardActions,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Pagination,
} from "@mui/material";
import { Edit, Delete, Close as CloseIcon } from "@mui/icons-material";
import axios from "axios";
import { BASE_API_URL, getBearerToken } from "./api/apiConfig";
import { Course } from "./interfaces/Course";
import { useTheme } from "@mui/material/styles";

interface CoursesListProps {
  courses: Course[];
  onCourseUpdated: () => void;
  onEditCourse: (course: Course) => void;
}

const CoursesList: React.FC<CoursesListProps> = ({
  courses,
  onCourseUpdated,
  onEditCourse,
}) => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const token = getBearerToken();
  const theme = useTheme();

 
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;
  const pageCount = Math.ceil(courses.length / itemsPerPage);
  const displayedCourses = courses.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleChangePage = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleAction = async (
    courseId: number,
    action: "edit" | "delete",
    event: React.MouseEvent
  ) => {
    event.stopPropagation();

    try {
      if (action === "edit") {
        const { data } = await axios.get(`${BASE_API_URL}/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        onEditCourse(data);
      } else {
        await axios.delete(`${BASE_API_URL}/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        onCourseUpdated();
      }
    } catch (error) {
      console.error(`Error ${action}ing course:`, error);
      alert(`Failed to ${action} course`);
    }
  };

  const handleCardClick = (course: Course) => {
    setSelectedCourse(course);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedCourse(null);
    setOpenModal(false);
  };

  return (
    <div>
      <Grid container spacing={3} sx={{ p: 3 }}>
        {displayedCourses.map(
          ({
            id,
            coverImage,
            title,
            shortDescription,
            categoryId,
            price,
            rate,
            description,
          }) => (
            <Grid item xs={12} sm={6} md={4} key={id}>
              <Card
                sx={{
                  height: "100%",
                  cursor: "pointer",
                  boxShadow: 2,
                  transition: "0.3s",
                  "&:hover": { transform: "scale(1.05)" },
                }}
                onClick={() =>
                  handleCardClick({
                    id,
                    coverImage,
                    title,
                    shortDescription,
                    categoryId,
                    price,
                    rate,
                    description,
                    slug: "",
                    discount: 0,
                    isFree: false,
                    coverFile: null,
                    expireYear: 0,
                    expireMonth: 0,
                    expireDay: 0,
                    itemSpecifications: [],
                  })
                }
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={coverImage}
                  alt={title}
                  sx={{ objectFit: "cover" }}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {shortDescription}
                  </Typography>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="primary">
                      {categoryId}
                    </Typography>
                    <Typography variant="body2" color="text.primary">
                      ${price}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" mt={2}>
                    Rating: {rate ?? "No rating"}★
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    onClick={(e) => handleAction(id, "edit", e)}
                    startIcon={<Edit />}
                  >
                    Update
                  </Button>
                  <Button
                    onClick={(e) => handleAction(id, "delete", e)}
                    startIcon={<Delete />}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          )
        )}
      </Grid>

      
      <Box display="flex" justifyContent="center" mt={2}>
        <Pagination
          count={pageCount}
          page={page}
          onChange={handleChangePage}
          color="primary"
        />
      </Box>

      <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <Box
          sx={{
            bgcolor: theme.palette.mode === "dark" ? "#333" : "#fff",
            borderRadius: 2,
            p: 3,
            color: theme.palette.mode === "dark" ? "white" : "black",
            transition: "background-color 0.3s ease",
          }}
        >
          <DialogTitle
            sx={{
              fontWeight: 700,
              fontSize: "1.5rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" component="span">
              {selectedCourse?.title}
            </Typography>
            <IconButton onClick={handleCloseModal} color="primary">
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ paddingTop: 0 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Full Description
            </Typography>
            <Typography variant="body1" paragraph sx={{ color: "text.secondary" }}>
              {selectedCourse?.description || "No description available."}
            </Typography>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography variant="body2" color="primary">
                Category: {selectedCourse?.categoryId}
              </Typography>
              <Typography variant="body2" color="text.primary">
                Price: ${selectedCourse?.price}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" mt={2}>
              Rating: {selectedCourse?.rate ?? "No rating"}★
            </Typography>
          </DialogContent>
          <DialogActions sx={{ justifyContent: "flex-end" }}>
            <Button onClick={handleCloseModal} color="primary" variant="outlined">
              Close
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </div>
  );
};

export default CoursesList;


