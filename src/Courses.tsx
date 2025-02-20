
import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  SelectChangeEvent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import CoursesList from "./CoursesList";
import axios from "axios";
import { BASE_API_URL, getBearerToken } from "./api/apiConfig";
import { Course } from "./interfaces/Course";

const initialCourseState: Course = {
  id: 0,
  slug: "",
  title: "",
  shortDescription: "",
  description: "",
  categoryId: 1,
  price: 0,
  discount: 0,
  isFree: false,
  coverFile: null,
  expireYear: 0,
  expireMonth: 0,
  expireDay: 0,
  itemSpecifications: [],
};

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [newCourse, setNewCourse] = useState<Course>(initialCourseState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (getBearerToken()) {
      fetchCourses();
    }
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${BASE_API_URL}/courses`, {
        headers: { Authorization: `Bearer ${getBearerToken()}` },
      });
      setCourses(Array.isArray(data.data) ? data.data : []);
    } catch {
      setError("Error fetching courses");
    } finally {
      setLoading(false);
    }
  };

  const handlePost = async () => {
    try {
      const formData = new FormData();
  

      Object.keys(newCourse).forEach((key) => {
        const typedKey = key as keyof Course;
        const value = newCourse[typedKey];
  
        if (value !== null && value !== undefined) {
          if (typedKey === "coverFile") {
           
            if (value instanceof File) {
              formData.append("CoverFile", value);
            }
          } else if (typedKey === "itemSpecifications") {
           
            formData.append("ItemSpecifications", JSON.stringify(value));
          } else {
            formData.append(key, value.toString());
          }
        }
      });
  
     
      if (isEditing) {
        formData.append("Id", String(newCourse.id));
      }
  
      await axios[isEditing ? "put" : "post"](
        `${BASE_API_URL}/courses`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${getBearerToken()}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      fetchCourses();
      resetForm();
    } catch (error) {
      console.error("Error creating/updating course", error);
    }
  };
  

  const resetForm = () => {
    setNewCourse(initialCourseState);
    setIsEditing(false);
  };

  const handleEditCourse = (course: Course) => {
    setNewCourse(course);
    setIsEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setNewCourse({ ...newCourse, [e.target.name]: e.target.value });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setNewCourse({ ...newCourse, coverFile: e.target.files[0] });
    }
  };

  const handleBooleanChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setNewCourse({ ...newCourse, isFree: e.target.checked });

  const handleSelectChange = (e: SelectChangeEvent<number>) => {
    setNewCourse({ ...newCourse, [e.target.name]: Number(e.target.value) });
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    resetForm();
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <>
          <CoursesList
            courses={courses}
            onCourseUpdated={fetchCourses}
            onEditCourse={handleEditCourse}
          />

          {isEditing && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h4" gutterBottom>
                Update Course
              </Typography>
              <Box component="form" sx={{ display: "grid", gap: 2 }}>
                {[
                  "slug",
                  "title",
                  "shortDescription",
                  "description",
                  "price",
                  "discount",
                  "expireYear",
                  "expireMonth",
                  "expireDay",
                ].map((field) => (
                  <TextField
                    key={field}
                    label={field}
                    variant="outlined"
                    name={field}
                    value={newCourse[field as keyof Course] as string | number}
                    onChange={handleChange}
                    type={
                      field.includes("price") || field.includes("expire")
                        ? "number"
                        : "text"
                    }
                  />
                ))}
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="categoryId"
                    value={newCourse.categoryId}
                    onChange={handleSelectChange}
                  >
                    {[1, 2, 3, 4, 5, 6].map((cat) => (
                      <MenuItem key={cat} value={cat}>
                        Category {cat}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={newCourse.isFree}
                      onChange={handleBooleanChange}
                    />
                  }
                  label="Is Free"
                />
                <TextField
                  type="file"
                  name="coverFile"
                  onChange={handleFileChange}
                />
                <Button variant="contained" onClick={handlePost}>
                  Update Course
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleCancelEdit}
                  color="secondary"
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          )}

          {!isEditing && (
            <IconButton
              onClick={handleOpenModal}
              sx={{
                position: "fixed",
                bottom: 20,
                right: 20,
                backgroundColor: "primary.main",
                color: "white",
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
              }}
            >
              <AddIcon />
            </IconButton>
          )}

          <Dialog
            open={openModal}
            onClose={handleCloseModal}
            fullWidth
            maxWidth="sm"
          >
            <DialogTitle>Add a New Course</DialogTitle>
            <DialogContent>
              <Box component="form" sx={{ display: "grid", gap: 2 }}>
                {[
                  "slug",
                  "title",
                  "shortDescription",
                  "description",
                  "price",
                  "discount",
                  "expireYear",
                  "expireMonth",
                  "expireDay",
                ].map((field) => (
                  <TextField
                    key={field}
                    label={field}
                    variant="outlined"
                    name={field}
                    value={newCourse[field as keyof Course] as string | number}
                    onChange={handleChange}
                    type={
                      field.includes("price") || field.includes("expire")
                        ? "number"
                        : "text"
                    }
                  />
                ))}
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="categoryId"
                    value={newCourse.categoryId}
                    onChange={handleSelectChange}
                  >
                    {[1, 2, 3, 4, 5, 6].map((cat) => (
                      <MenuItem key={cat} value={cat}>
                        Category {cat}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={newCourse.isFree}
                      onChange={handleBooleanChange}
                    />
                  }
                  label="Is Free"
                />
                <TextField
                  type="file"
                  name="coverFile"
                  onChange={handleFileChange}
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseModal} color="secondary">
                Cancel
              </Button>
              <Button onClick={handlePost} variant="contained" color="primary">
                Add Course
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default Courses;

